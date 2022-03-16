import model from '../models';
import {filterByDay, filterByLastMonth, filterByLastWeek, formatData} from '../services/date';

const { Metric } = model;

const types = ['ap','waist','bmi','glucose',
    'totalCholest', 'goodCholest', 'badCholest',
    'cardiovascular', 'riskFactors'];

const periods = ['day', 'week', 'month'];

export default {
    async addMetric(req, res) {
        try {
            const user = req.user;
            const { type, fields } = req.body;
            if (!types.includes(type)) {
                return res.status(401).send({message: 'Неверный тип'});
            }
            await Metric.create({ type, fields, userId: user.id });
            return res.status(200).send({message: null});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
    async getMetrics(req, res) {
        try {
            const user = req.user;
            const { type, period } = req.body;
            if (!types.includes(type)) {
                return res.status(401).send({message: 'Неверный тип'});
            }
            if (period && !periods.includes(period)) {
                return res.status(401).send({message: 'Неверный период'});
            }
            const metrics = await Metric.findAll({ where: {
                    userId: user.id,
                    type
                } });
            let filtered;

            switch (period) {
                case 'day': {
                    filtered = filterByDay(metrics);
                    break;
                }
                case 'week': {
                    filtered = filterByLastWeek(metrics);
                    break;
                }
                case 'month': {
                    filtered = filterByLastMonth(metrics);
                    break;
                }
                default: {
                    filtered = metrics;
                }
            }
            const formatted = filtered.map((it) => {
                return { ...it.fields, createdAt: it.createdAt, id: it.id }
            });
            const result = formatData(formatted);

            return res.status(200).send({message: null, data: {
                    metrics: result.reverse()
                }});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },

    async changeMetric(req, res) {
        try {
            const { fields, id } = req.body;
            const metric = await Metric.findOne({where: { id: id }});
            if (!metric) {
                return res.status(404).send('Данные не найдены');
            }
            await metric.update({ fields })
            return res.status(200).send({message: null});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },

    async deleteMetric(req, res) {
        try {
            const { id } = req.body;
            const metric = await Metric.destroy({where: { id: id }});
            if (!metric) {
                return res.status(404).send('Данные не найдены');
            }
            return res.status(200).send({message: null});
        } catch (e) {
            console.log(e);
            return res.status(500).send('Ошибка сервера');
        }
    },
}