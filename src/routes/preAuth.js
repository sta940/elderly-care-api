import AuthController from '../controllers/AuthController.js'
import FileController from '../controllers/FileController.js'
import AppController from '../controllers/AppController.js'
import upload from '../services/multer';

export default (app) => {
    app.post('/register', AuthController.signUp);
    app.post('/login', AuthController.signIn);
    app.get('/verify/:token', AuthController.verify);
    app.post('/upload', upload.single("image"), FileController.uploadSingle);

    app.get('/intro', AppController.getIntro);
    app.get('/introInstructions', AppController.getIntroInstruction);
    app.get('/instructions', AppController.getInstruction);
};