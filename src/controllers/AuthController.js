import { Op } from 'sequelize';
import model from '../models';
import jwt from 'jsonwebtoken';
import sendEmail from '../services/mailer'

const { User } = model;


export default {
    async signUp(req, res) {
        const {email, password, role} = req.body;
        try {
            const user = await User.findOne({where: {[Op.and]: [ {email}, {password} ]}});
            if (user) {
                return res.status(401).send({message: 'User already exist'});
            }
            await User.create({ email, password, role });
            const token = jwt.sign({ email }, 'TOKEN_SECRET', { expiresIn: 6000 });
            sendEmail(email, token, req.hostname);
            return res.status(200).send({message: 'Account created successfully'});
        } catch(e) {
            console.log(e);
            return res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
        }
    },

    async signIn(req, res) {
        const {email, password} = req.body;
        try {
            const user = await User.findOne({where: {[Op.and]: [ {email}, {password} ]}});
            if(!user) {
                return res.status(401).send({message: 'Invalid credentials'});
            }

            return res.status(200).send({message: 'Login successfully', data: { token }});
        } catch(e) {
            console.log(e);
            return res.status(500).send({message: 'Could not perform operation at this time, kindly try again later.'});
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