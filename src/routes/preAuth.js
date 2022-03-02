import AuthController from '../controllers/AuthController.js'
import FileController from '../controllers/FileController.js'
import upload from '../services/multer';

export default (app) => {
    app.post('/register', AuthController.signUp);
    app.post('/login', AuthController.signIn);
    app.get('/verify/:token', AuthController.verify);
    app.post('/upload', upload.single("image"), FileController.uploadSingle)
};