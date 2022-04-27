import model from '../models';
import {uploadFile, uploadPdf, uploadSurveyPdf} from "../services/s3";
import moment from "moment";
import util from "util";
import fs from "fs";
const unlinkFile = util.promisify(fs.unlink);

const { Survey, Report } = model;

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

function checkAnswer(data, answers) {
  const result = [];
  if (data) {
    data.forEach((it) => {
      if (it.answers) {
        const answersKeys = Object.keys(it.answers);
        for (let i=0; i < answersKeys.length; i++) {
          const ansKey = answersKeys[i];
          if(ansKey !== 'special' && it.answers[ansKey].includes(answers[ansKey])) {
            result.push(it.text);
            break;
          }
        }
      } else {
        result.push(it.text);
      }
    })
  }
  return result;
}

export default {
  async getSurvey(req, res) {
    try {
      const { role } = req.user;
      let surveyData, interpData = null;
      if (role === 'social') {
        surveyData = await Survey.findOne({where: { key: 'survey1' }});
        interpData = await Survey.findOne({where: { key: 'interQuest1' }});
      } else {
        surveyData = await Survey.findOne({where: { key: 'survey2' }});
      }
      return res.status(200).send({ data: {
          surveyData: surveyData.meta,
          interpretationData: interpData?.meta
        } });
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },

  async getSurveyResult(req, res) {
    try {
      const { answers, user } = req.body;

      const recommendations = [];
      const interpretations = [];

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

      const keys = ["block1", "block2"];
      keys.forEach((key) => {
        const range = getRangeKey(key, sum, interRecData.meta.blocks);
        const data = interRecData.meta.blocks[key][range];
        recommendations.push({
          groupNumber: data.groupNumber,
          content: data.main,
          title: parsedSurvey[key].title,
        });

        const med = checkAnswer(data.med, answers);
        const social = checkAnswer(data.social, answers);
        const env = checkAnswer(data.env, answers);
        const common = checkAnswer(data.common, answers);

        const resObj = {
          title: parsedSurvey[key].title,
          emergency: [],
          recommendations: [
            {
              title: "Медицинская помощь",
              list: med
            },
            {
              title: "Социальные услуги ",
              list: social
            },
            {
              title: "Работа с окружением",
              list: env
            },
            {
              title: "Общие рекоммендации ",
              list: common
            }
          ]
        };
        interpretations.push(resObj);
      });

      const block3 = parsedSurvey["block3"];
      const list = [];
      Object.keys(block3.questions).forEach((key) => {
        const ans = answers[key];
        if (Number.isInteger(ans) && ans > 0) {
          list.push(block3.questions[key]);
        }
      });
      recommendations.push({
        content: list,
        isList: true,
        title: parsedSurvey["block3"].title
      });

      await uploadSurveyPdf(user , recommendations, interpretations);

      const today = moment().locale('ru').format('L');
      const file = {
        path: "public/files/survey.pdf",
        filename: `опрос(${today}).pdf`
      }
      const result = await uploadFile(file);
      await unlinkFile(file.path);

      await Report.create({ filename: file.filename, link: result.Location, userId: req.user.id });

      return res.status(200).send({message: null, data: {
          filename: file.filename,
          link: result.Location
        }});

      // return res.status(200).send({interpretations});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },
}