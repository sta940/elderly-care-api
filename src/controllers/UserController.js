import model from '../models';

const { User } = model;

export default {
    async userInfo(req, res) {
        try {
            const user = req.user;
            return res.status(200).send({message: null, data: { user: { email: user.email, role: user.role, gender: user.gender, reports: user.reports } }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },

    async deleteUser(req, res) {
        try {
            const user = req.user;
            const usr = await User.destroy({where: { id: user.id }});
            if (!usr) {
                return res.status(404).send('Данные не найдены');
            }
            return res.status(200).send({message: null});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
}