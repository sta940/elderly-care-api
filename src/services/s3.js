import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
import dotenv from 'dotenv';
import pdf from "pdf-creator-node";


const html = fs.readFileSync("template.html", "utf8");
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
    console.log(file.path)
    const fileStream = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: file.filename,
    };
    return s3.upload(uploadParams).promise();
}

function uploadPdf() {
    const options = {
        format: "A4",
        orientation: "portrait",
        border: "10mm",
    };
    const notifications = [
        {
            "formattedDate": "вторник(22 марта 2022 г.)",
            "data": [
                {
                    "description": 'fcdsf dsv fd xzcx zxc dss dks c dscj dskc ds  d ds  dsh dhk dsj dsj dsh dhjs dsj',
                    "time": "10:20"
                }]
        },
        {
            "formattedDate": "вторник(24 марта 2022 г.)",
            "data": [
                {
                    "description": 'fcdsf dsv fd',
                    "time": "10:20"
                }]
        }
    ];
    const document = {
        html: html,
        data: {
            notifications,
        },
        path: "./public/files/calendar.pdf",
        type: "",
    };

    return pdf.create(document, options);
}
module.exports = { uploadFile, uploadPdf };