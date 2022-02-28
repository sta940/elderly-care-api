import UserController from '../controllers/UserController.js'

export default (app) => {
    app.get('/user', UserController.userInfo);
};