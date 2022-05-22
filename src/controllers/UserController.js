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
}