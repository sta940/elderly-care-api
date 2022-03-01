import S3 from 'aws-sdk/clients/s3';
import fs from 'fs';
const multer  = require('multer')
var multerS3 = require('multer-s3')

console.log(process.env)
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
    bucket: bucketName
});

// function uploadFile(file) {
//     const fileStream = fs.createReadStream(file.path);
//     const uploadParams = {
//         Bucket: bucketName,
//         Body: fileStream,
//         Key: file.filename,
//     };
//     return s3.upload(uploadParams).promise();
// }

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket:bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString())
        }
    })
})

module.exports = { upload };