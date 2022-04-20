import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import dotenv from 'dotenv';
import pdf from "pdf-creator-node";
import moment from "moment";


const html = fs.readFileSync("template.html", "utf8");
const surveyHtml = fs.readFileSync("survey.html", "utf8");
const bitmap = fs.readFileSync(__dirname + "/images/logo_58_58.png");
const logo = bitmap.toString('base64');
dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

function uploadFile(file) {
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
}

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

const user = {
    name: "Иван",
    surname: "Петров",
    age: 51,
    gender: "M"
}

const genericRecommendations = [
    {
        title: "СОЦИАЛЬНАЯ АДАПТАЦИЯ И ИНТЕГРАЦИЯ",
        groupNumber: 3,
        content: "Незначительные когнитивные нарушения или психологические сложности. Или их высокий риск. Риск социальной дезинтеграции. Нуждается в профилактических мероприятиях, когнитивной стимуляции, поддержке физической и социальной активности"
    },
    {
        title: "НЕЗАВИСИМОСТЬ В БЫТУ",
        groupNumber: 4,
        content: "Нуждается в регулярной помощи в быту и при самообслуживании (социально-бытовые услуги 3 раза в неделю)"
    },
    {
        title: "СОЦИАЛЬНЫЕ РИСКИ",
        isList: true,
        content: [
          "Наличие задолженности по оплате коммунальных платежей, платежей за пользование жилым помещением",
          "Материальное положение",
          "Наличие признаков жестокого обращения, насилия в отношении пожилого человека (физического, психического, экономического, сексуального)"
        ]
    }
]

const blocks = [
    {
        title: "СОЦИАЛЬНАЯ АДАПТАЦИЯ И ИНТЕГРАЦИЯ",
        emergency: [
          "Человека нельзя оставлять одного. Необходимо найти лицо, которое обеспечит уход/присмотр временно (до прихода специалиста) или обратиться в организацию здравоохранения",
          "Принять меры по организации временной посторонней помощи (до организации регулярного обслуживания)"
        ],
        recommendations: [
            {
                title: "Социальные услуги",
                list: [
                  "Рекомендации по поддержканию двигательной и социальной активности, поддержанию активности через повседневный быт.",
                  "Рекомендовать посещение отделения дневного пребывания для пожилых людей с целью когниивной стимуляции, выполнения мультимодальных упражнений."
                ]
            },
            {
                title: "Медицинская помощь",
                list: [
                    "Рекомендации по поддержканию двигательной и социальной активности, поддержанию активности через повседневный быт.",
                    "Рекомендовать посещение отделения дневного пребывания для пожилых людей с целью когниивной стимуляции, выполнения мультимодальных упражнений."
                ]
            },
            {
                title: "Общие рекоммендации",
                list: [
                    "Рекомендации по поддержканию двигательной и социальной активности, поддержанию активности через повседневный быт.",
                    "Рекомендовать посещение отделения дневного пребывания для пожилых людей с целью когниивной стимуляции, выполнения мультимодальных упражнений."
                ]
            }
        ]
    }
]


function uploadSurveyPdf() {
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
        path: "./public/files/survey.pdf",
        type: "",
    };

    return pdf.create(document, options);
}
module.exports = { uploadFile, uploadPdf, uploadSurveyPdf };