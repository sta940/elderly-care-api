import model from '../models';
import {uploadSurveyPdf} from "../services/s3";

const { Survey } = model;

function parseSurvey(surveyData) {
  const result = {};
  const keys = ["block1", "block2", "block3"];
  surveyData.blocks.forEach((block) => {
    if (keys.includes(block.key)) {
      const questions = {};
      block.sections.forEach((sec) => {
        sec.questions.forEach((q) => {
          questions[q.key] = q.question;
        });
      });
      result[block.key] = {
        title: block.subtitle,
        questions
      };
    }
  });
  return result;
}

function getRangeKey(key, sum, rec) {
  let interRange;
  const ranges = Object.keys(rec[key]);
  ranges.forEach((range) => {
    const parts = range.split("-");
    const min = Number(parts[0]);
    const max = Number(parts[1]);
    if (sum[key] >= min && sum[key] <= max) {
      interRange = range;
    }
  });
  return interRange;
}

export default {
  async getSurveyResult(req, res) {
    try {
      const { answers } = req.body;
      console.log(answers)
      const surveyData = await Survey.findOne({where: { key: 'survey1' }});
      const interRecData = await Survey.findOne({where: { key: 'interRec1' }});

      let sum = {
        block1: 0,
        block2: 0
      };

      Object.keys(answers).forEach((key) => {
        if (key.includes("block1")) {
          sum.block1 += answers[key];
        }
        if (key.includes("block2")) {
          sum.block2 += answers[key];
        }
      });

      const parsedSurvey = parseSurvey(surveyData.meta);
      console.log(interRecData.meta)

      const keys = ["block1", "block2"];
      const result = [];
      keys.forEach((key) => {
        const range = getRangeKey(key, sum, interRecData.meta.blocks);
        const data = interRecData.meta.blocks[key][range];
        result.push({
          groupNumber: data.groupNumber,
          content: data.main,
          title: parsedSurvey[key].title
        });
      });

      const block3 = parsedSurvey["block3"];
      const list = [];
      Object.keys(block3.questions).forEach((key) => {
        const ans = answers[key];
        if (Number.isInteger(ans) && ans > 0) {
          list.push(block3.questions[key]);
        }
      });
      result.push({
        content: list,
        isList: true,
        title: parsedSurvey["block3"].title
      });


      return res.status(200).send({ data: result });
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },
}