import { Op } from 'sequelize';
import model from '../models';
import jwt from 'jsonwebtoken';
import sendEmail from '../services/mailer'

const { User } = model;


export default {
    async signUp(req, res) {
        const {email, password, role} = req.body;
        const roles = ['social', 'caring']
        try {
            if (!roles.includes(role)) {
                return res.status(401).send({message: 'Неверная роль'});
            }
            const user = await User.findOne({ where: { email } });
            if (user) {
                return res.status(401).send({message: 'Пользователь с такими данными уже существует'});
            }
            await User.create({ email, password, role });
            const token = jwt.sign({ email, role }, 'TOKEN_SECRET', { expiresIn: '360d' });
            sendEmail(email, token, req.hostname);
            return res.status(200).send({message: null, data: { token }});
        } catch(e) {
            console.log(e);
            return res.status(500).send({message: 'Ошибка сервера'});
        }
    },

    async signIn(req, res) {
        const {email, password} = req.body;
        try {
            const user = await User.findOne({where: {[Op.and]: [ {email}, {password} ]}});
            if(!user) {
                return res.status(401).send({message: 'Неверный логин или пароль'});
            }

            const token = jwt.sign({ email, role: user.role }, 'TOKEN_SECRET', { expiresIn: '360d' });
            return res.status(200).send({message: null, data: { token }});
        } catch(e) {
            console.log(e);
            return res.status(500).send({message: 'Ошибка сервера'});
        }
    },

    async verify(req, res) {
        try {
            const { token } = req.params;
            const decoded = jwt.verify(token, 'TOKEN_SECRET');
            const user = await User.findOne({where: { email: decoded.email }});
            if (!user) {
                return res.status(200).send('Почта не была подтверждена, запросите новое письмо');
            }
            await user.update({ isVerified: true })
            return res.status(200).send('Ваша почта успешно подтверждена!!!');
        } catch (e) {
            console.log(e);
            return res.status(200).send('Почта не была подтверждена, запросите новое письмо');
        }
    },
}