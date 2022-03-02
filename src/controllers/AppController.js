import model from '../models';

const { Intro, IntroInstruction, Instruction} = model;

export default {
    async getIntro(req, res) {
        try {
            const intro = await Intro.findAll();
            return res.status(200).send({message: null, data: { intro }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
    async getIntroInstruction(req, res) {
        try {
            const introInstructions = await IntroInstruction.findAll();
            return res.status(200).send({message: null, data: { introInstructions }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
    async getInstruction(req, res) {
        try {
            const instructions = await Instruction.findAll();
            return res.status(200).send({message: null, data: { instructions }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
}