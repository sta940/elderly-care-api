import { Op } from 'sequelize';
import model from '../models';
import jwt from 'jsonwebtoken';
import sendEmail from '../services/mailer'

const { User } = model;


export default {
    async userInfo(req, res) {
        try {
            const userFromToken = req.user;
            const user = await User.findOne({where: { email: userFromToken.email }});
            if (!user) {
                return res.status(401).send('Пользователь не найден');
            }
            return res.status(200).send({message: null, data: { user: { ...userFromToken } }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
}