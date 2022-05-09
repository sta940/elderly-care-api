import model from '../models';
import {uploadFile} from "../services/s3";
import moment from "moment";
import util from "util";
import fs from "fs";
import { uploadSurveyPdf, uploadCaringSurveyPdf } from "../services/pdf";
const unlinkFile = util.promisify(fs.unlink);

const { Survey, Report } = model;
const specialFields = ["rec1.3.5.1", "rec2.1.2.3", "rec2.1.3.1", "rec2.3.10", "rec2.3.11", "rec2.3.13.1", "rec2.3.13.2", "rec3.1.3.5", "rec3.1.3.6", "rec3.1.3.7", "rec3.1.3.8",  "rec3.1.4.1", "rec3.1.4.2", "rec3.1.5.1"];

function parseSurvey(surveyData, keys) {
  const result = {};
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

function sortRecommendations(rec) {
  const types = {
    'emerg': [],
    'med': [],
    'social': [],
    'env': [],
    'common': []
  }
  rec.forEach((it) => {
    types[it.type].push(it);
  });
  return types;
}

function filterRecommendations(sortedRec, answers) {
  const result = {};
  Object.keys(sortedRec).forEach((key) => {
    const data = [];
    sortedRec[key].forEach((it) => {
      const answersKeys = Object.keys(it.answers);
      if (specialFields.includes(it.key)) {
        let check = false;
        for (let i=0; i < answersKeys.length; i++) {
          const ansKey = answersKeys[i];
          if (it.answers[ansKey].includes(answers[ansKey])) {
            check = true;
          } else {
            check = false;
            break;
          }
        }
        check && data.push(it.text);
      } else {
        for (let i=0; i < answersKeys.length; i++) {
          const ansKey = answersKeys[i];
          if (it.answers[ansKey].includes(answers[ansKey])) {
            data.push(it.text);
            break;
          }
        }
      }
    })
    result[key] = data;
  })
  return result;
}

function sortCaringRecommendations(rec) {
  const types = {
    'main': [],
    'other': []
  }
  rec.forEach((it) => {
    types[it.type].push(it);
  });
  return types;
}

function filterCaringRecommendations(sortedRec, answers) {
  const result = {};
  Object.keys(sortedRec).forEach((key) => {
    const data = [];
    sortedRec[key].forEach((it) => {
      const answersKeys = Object.keys(it.answers);
      for (let i=0; i < answersKeys.length; i++) {
        const ansKey = answersKeys[i];
        if (it.answers[ansKey].includes(answers[ansKey])) {
          data.push(...it.text);
          break;
        }
      }
    })
    result[key] = data;
  })
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
      const { role } = req.user;
      const today = moment().locale('ru').format('L');
      const filename = `${user.name}(возраст: ${user.age})(${today})`;
      const recommendations = [];
      const interpretations = [];

      if (role === 'caring') {
        const surveyData = await Survey.findOne({where: { key: 'survey2' }});
        const recData = await Survey.findOne({where: { key: 'rec2' }});

        const keys = ["block1", "block2", "block3", "block4", "block5", "block6", "block7"];
        const parsedSurvey = parseSurvey(surveyData.meta, keys);

        keys.forEach((key) => {
          let main = [], other = [];
          const sortedRec = sortCaringRecommendations(recData.meta.blocks[key].recommendations);
          const filteredRec = filterCaringRecommendations(sortedRec, answers);

          main.push(...filteredRec['main']);
          other.push(...filteredRec['other']);

          if (main.length > 0 || other.length > 0) {
            const resObj = {
              title: parsedSurvey[key].title,
              recommendations: [
                {
                  title: "Рекомендации для родственников",
                  list: main
                },
                {
                  title: "Взаимодействие с медицинскими, социальными и иными службами",
                  list: other
                }
              ]
            };
            interpretations.push(resObj);
          }
        });

        await uploadCaringSurveyPdf(user, interpretations, filename);

      } else {
        const surveyData = await Survey.findOne({where: { key: 'survey1' }});
        const recData = await Survey.findOne({where: { key: 'rec1' }});
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

        const keys = ["block1", "block2", "block3"];
        const parsedSurvey = parseSurvey(surveyData.meta, keys);

        keys.forEach((key) => {
          let med = [], social = [], common = [], env = [], emerg = [];
          const sortedRec = sortRecommendations(recData.meta.blocks[key].recommendations);
          const filteredRec = filterRecommendations(sortedRec, answers);
          if (key !== "block3") {
            const range = getRangeKey(key, sum, interRecData.meta.blocks);
            const data = interRecData.meta.blocks[key][range];
            recommendations.push({
              groupNumber: data.groupNumber,
              content: data.main,
              title: parsedSurvey[key].title,
            });

            med = checkAnswer(data.med, answers);
            social = checkAnswer(data.social, answers);
            env = checkAnswer(data.env, answers);
            common = checkAnswer(data.common, answers);
            emerg = checkAnswer(data.emerg, answers);
          }

          med.push(...filteredRec['med']);
          social.push(...filteredRec['social']);
          env.push(...filteredRec['env']);
          common.push(...filteredRec['common']);
          emerg.push(...filteredRec['emerg']);

          const resObj = {
            title: parsedSurvey[key].title,
            emergency: emerg,
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
                title: "Общие рекоммендации",
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

        await uploadSurveyPdf(user , recommendations, interpretations, filename);
      }

      const file = {
        path: `public/files/${filename}.pdf`,
        filename: `${filename}.pdf`
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