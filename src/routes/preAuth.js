import AuthController from '../controllers/AuthController.js'

export default (app) => {
    app.post('/register', AuthController.signUp);
    app.post('/login', AuthController.signIn);
    app.get('/verify/:token', AuthController.verify);
};