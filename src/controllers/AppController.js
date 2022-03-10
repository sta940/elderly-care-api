import model from '../models';

const { Intro, IntroInstruction, Instruction, CaseManagement, Quality, Info} = model;

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
    async getCaseManagement(req, res) {
        try {
            const caseManagement = await CaseManagement.findAll();
            return res.status(200).send({message: null, data: { caseManagement: caseManagement[0] }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
    async getQuality(req, res) {
        try {
            const quality = await Quality.findAll();
            return res.status(200).send({message: null, data: { quality: quality[0] }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
    async getInfo(req, res) {
        try {
            const info = await Info.findAll();
            return res.status(200).send({message: null, data: { info: info[0] }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },

}