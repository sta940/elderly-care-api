import express from 'express';
import preAuthRoute from './src/routes/preAuth.js'
import authRoute from './src/routes/auth.js'
import auth from './src/middleware/auth';
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/reset',(req,res,next)=>{
    res.sendFile(path.join(__dirname,'changePassword.html'));
});

preAuthRoute(app);

app.get('/', (req, res) => res.status(200).send({
    message: 'Health',
}));

app.use(auth);

authRoute(app);

const port = 3000;

app.listen(port, () => {
    console.log('App is now running at port ', port)
})