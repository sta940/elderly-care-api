import model from '../models';
import {
  filterByDay,
  filterByNextMonth, filterByNextWeek,
  formatData,
} from '../services/date';

const { Reminder } = model;
const periods = ['day', 'week', 'month'];

export default {
  async addReminder(req, res) {
    try {
      const user = req.user;
      const { name, description, date } = req.body;
      await Reminder.create({ name, description, date, userId: user.id });
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },
  async getReminders(req, res) {
    try {
      const user = req.user;
      const { period } = req.body;
      if (period && !periods.includes(period)) {
        return res.status(401).send({message: 'Неверный период'});
      }
      const reminders = await Reminder.findAll({ where: {
          userId: user.id
        } });

      let filtered;

      switch (period) {
        case 'day': {
          filtered = filterByDay(reminders);
          break;
        }
        case 'week': {
          filtered = filterByNextWeek(reminders);
          break;
        }
        case 'month': {
          filtered = filterByNextMonth(reminders);
          break;
        }
        default: {
          filtered = reminders;
        }
      }
      const formatted = filtered.map((it) => {
        return { name: it.name, description: it.description, date: it.date}
      }).sort((a,b) => {
        const date1 = new Date(a.date).getTime();
        const date2 = new Date(b.date).getTime();
        return period ? date1 - date2 : date2 - date1;
      });

      const result = formatData(formatted);

      return res.status(200).send({message: null, data: {
          reminders: result.map((it) => {
            const sorted = it.data.sort((a, b) => {
              const date1 = new Date(a.date).getTime();
              const date2 = new Date(b.date).getTime();
              return date1 - date2;
            })
            return {...it, data: sorted}
          })
        }});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },

  async changeReminder(req, res) {
    try {
      const { name, description, date, id } = req.body;
      const reminder = await Reminder.findOne({where: { id: id }});
      if (!reminder) {
        return res.status(404).send('Данные не найдены');
      }
      await reminder.update({ name, description, date })
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  },

  async deleteReminder(req, res) {
    try {
      const { id } = req.body;
      const reminder = await Reminder.destroy({where: { id: id }});
      if (!reminder) {
        return res.status(404).send('Данные не найдены');
      }
      return res.status(200).send({message: null});
    } catch (e) {
      console.log(e);
      return res.status(500).send('Ошибка сервера');
    }
  }
}