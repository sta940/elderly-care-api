import {uploadFile} from '../services/s3';
import fs from 'fs';
import util from 'util';
const unlinkFile = util.promisify(fs.unlink);

export default {
    async uploadSingle(req, res) {
        try {
            const result = await uploadFile(req.file);
            await unlinkFile(req.file.path);

            return res.status(200).send({message: null, data: {
                    mimetype: req.file.mimetype,
                    filename: req.file.originalname,
                    link: result.Location
                }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
}