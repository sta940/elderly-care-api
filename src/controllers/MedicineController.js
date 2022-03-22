import model from '../models';
import {getMedicineSchedule} from '../services/date';

const { Medicine } = model;
const periods = ['day', 'week', 'month'];

export default {
  async addMedicine(req, res) {
    try {
      const user = req.user;
      const { name, time, dosage, days } = req.body;
      await Medicine.create({ name, time, dosage, days, userId: user.id });
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },
  async getMedicines(req, res) {
    try {
      const user = req.user;
      const { period } = req.body;
      if (!periods.includes(period)) {
        return res.status(401).send({message: 'Неверный период'});
      }
      const medicines = await Medicine.findAll({ where: {
          userId: user.id
        } });

      const result = getMedicineSchedule(medicines, period);

      return res.status(200).send({message: null, data: {
          medicines: result
        }});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },

  async changeMedicine(req, res) {
    try {
      const { name, time, dosage, days, id } = req.body;
      const medicine = await Medicine.findOne({where: { id: id }});
      if (!medicine) {
        return res.status(404).send('Данные не найдены');
      }
      await medicine.update({ name, time, dosage, days })
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },

  async deleteMedicine(req, res) {
    try {
      const { id } = req.body;
      const medicine = await Medicine.destroy({where: { id: id }});
      if (!medicine) {
        return res.status(404).send('Данные не найдены');
      }
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  }
}