import UserController from '../controllers/UserController.js'
import MetricController from "../controllers/MetricController";

export default (app) => {
    app.get('/user', UserController.userInfo);

    app.post('/metric', MetricController.addMetric);
    app.post('/metrics', MetricController.getMetrics);
    app.put('/metric', MetricController.changeMetric);
    app.delete('/metric', MetricController.deleteMetric);
};