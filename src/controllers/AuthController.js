import { Op } from 'sequelize';
import model from '../models';
import jwt from 'jsonwebtoken';
import sendEmail from '../services/mailer'

const { User } = model;


export default {
    async signUp(req, res) {
        const {email, password, role, gender} = req.body;
        const roles = ['social', 'caring']
        try {
            if (!roles.includes(role)) {
                return res.status(401).send({message: 'Неверная роль'});
            }
            const user = await User.findOne({ where: { email } });
            if (user) {
                return res.status(401).send({message: 'Пользователь с такими данными уже существует'});
            }
            await User.create({ email, password, role, gender });
            const token = jwt.sign({ email, role, gender }, 'TOKEN_SECRET', { expiresIn: '360d' });
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

            const token = jwt.sign({ email, role: user.role, gender: user.gender }, 'TOKEN_SECRET', { expiresIn: '360d' });
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
            await user.update({ isVerified: true });
            return res.status(200).send('Ваша почта успешно подтверждена!!!');
        } catch (e) {
            console.log(e);
            return res.status(200).send('Почта не была подтверждена, запросите новое письмо');
        }
    },

    async forgotPassword(req, res) {
        try {
            const { email } = req.body;

            const user = await User.findOne({where: { email: email }});
            if (!user) {
                return res.status(404).send({message: 'Пользователь не найден'});
            }

            sendEmail(email, '', req.hostname);
            return res.status(200).send({});
        } catch (e) {
            return res.status(401).send({message:'Ошибка восстановления пароля. Попробуйте позже'});
        }
    },

    async changePassword(req, res) {
        try {
            const { email, password } = req.query;

            const user = await User.findOne({where: { email: email }});
            if (!user) {
                return res.status(404).send('Почта не была подтверждена, запросите новое письмо');
            }

            await user.update({ password: password });

            return res.status(200).send({});
        } catch (e) {
            console.log(e);
            return res.status(401).send('Почта не была подтверждена, запросите новое письмо');
        }
    },
}