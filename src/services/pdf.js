import pdf from "pdf-creator-node";
import moment from "moment";
import fs from 'fs';

const html = fs.readFileSync("template.html", "utf8");
const surveyHtml = fs.readFileSync("survey.html", "utf8");
const caringSurveyHtml = fs.readFileSync("caringSurvey.html", "utf8");
const bitmap = fs.readFileSync(__dirname + "/images/logo_58_58.png");
const logo = bitmap.toString('base64');

function uploadPdf(reminders) {
  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };

  const document = {
    html: html,
    data: {
      reminders,
    },
    path: "./public/files/calendar.pdf",
    type: "",
  };

  return pdf.create(document, options);
}

function uploadSurveyPdf(user, genericRecommendations, blocks, filename) {
  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };
  const today = moment().locale('ru').format('L');

  const document = {
    html: surveyHtml,
    data: {
      logo: logo,
      today,
      user,
      genericRecommendations,
      blocks
    },
    path: `./public/files/${filename}.pdf`,
    type: "",
  };

  return pdf.create(document, options);
}

function uploadCaringSurveyPdf(user, blocks, filename) {
  const options = {
    format: "A4",
    orientation: "portrait",
    border: "10mm",
  };
  const today = moment().locale('ru').format('L');

  const document = {
    html: caringSurveyHtml,
    data: {
      logo: logo,
      today,
      user,
      blocks
    },
    path: `./public/files/${filename}.pdf`,
    type: "",
  };

  return pdf.create(document, options);
}

module.exports = { uploadSurveyPdf, uploadPdf, uploadCaringSurveyPdf };