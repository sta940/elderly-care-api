import express from 'express';
import route from './src/routes/index.js'
const auth = require('./src/middleware/auth');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

route(app);

app.get('/', (req, res) => res.status(200).send({
    message: 'Hello World!',
}));

app.use(auth);

const port = 3000;

app.listen(port, () => {
    console.log('App is now running at port ', port)
})