import jwt from 'jsonwebtoken';
import model from '../models';

const { User } = model;

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { email } = jwt.verify(token, 'TOKEN_SECRET');
        const user = await User.findOne({where: { email }});
        if (!user) {
            return res.status(401).send({message: 'Пользователь не найден'});
        }
        req.user = user;
        next();
    } catch {
        res.status(401).send({message: 'Invalid token'});
    }
};