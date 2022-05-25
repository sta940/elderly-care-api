import jwt from 'jsonwebtoken';
import model from '../models';

const { User, Report } = model;

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (token) {
            const { email } = jwt.verify(token, 'TOKEN_SECRET');
            const user = await User.findOne({where: { email }});
            if (!user) {
                return res.status(401).send({message: 'Пользователь не найден'});
            }
            const reports = await Report.findAll({where: { userId: user.id }});
            req.user = user.dataValues;
            req.user['reports'] = reports;
            next();
        }
    } catch (e) {
        console.log(e)
        res.status(401).send({message: 'Invalid token'});
    }
};