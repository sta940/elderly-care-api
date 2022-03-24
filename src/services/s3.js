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
            notifications: reminders,
        },
        path: "./public/files/calendar.pdf",
        type: "",
    };

    return pdf.create(document, options);
}
module.exports = { uploadFile, uploadPdf };