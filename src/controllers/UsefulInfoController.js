import model from '../models';

const { UsefulInfo } = model;

export default {
  async addInfo(req, res) {
    try {
      await UsefulInfo.create({ ...req.body});
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },
  async getInfo(req, res) {
    try {
      const info = await UsefulInfo.findAll();

      return res.status(200).send({message: null, data: {
          info: info
        }});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },

  async changeInfo(req, res) {
    try {
      const { title, descr, youtubeVideoLink, list, time, id } = req.body;
      const info = await UsefulInfo.findOne({where: { id: id }});
      if (!info) {
        return res.status(404).send('Данные не найдены');
      }
      await info.update({ title, time, descr, youtubeVideoLink, list })
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },

  async deleteInfo(req, res) {
    try {
      const { id } = req.body;
      const info = await UsefulInfo.destroy({where: { id: id }});
      if (!info) {
        return res.status(404).send('Данные не найдены');
      }
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  }
}