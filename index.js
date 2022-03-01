import express from 'express';
import preAuthRoute from './src/routes/preAuth.js'
import authRoute from './src/routes/auth.js'
const auth = require('./src/middleware/auth');
import { upload } from './src/services/s3'

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

preAuthRoute(app);

app.get('/', (req, res) => res.status(200).send({
    message: 'Health',
}));

app.post('/upload', upload.single("image"), (req, res, next) => {
    res.send('Successfully uploaded ' + req.files.length + ' files!')
})

app.use(auth);

authRoute(app);

const port = 3000;

app.listen(port, () => {
    console.log('App is now running at port ', port)
})