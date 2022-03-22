import UserController from '../controllers/UserController.js'
import MetricController from "../controllers/MetricController";
import MedicineController from "../controllers/MedicineController";

export default (app) => {
    app.get('/user', UserController.userInfo);

    app.post('/metric', MetricController.addMetric);
    app.post('/metrics', MetricController.getMetrics);
    app.put('/metric', MetricController.changeMetric);
    app.delete('/metric', MetricController.deleteMetric);

    app.post('/medicine', MedicineController.addMedicine);
    app.post('/medicines', MedicineController.getMedicines);
    app.put('/medicine', MedicineController.changeMedicine)
    app.delete('/medicine', MedicineController.deleteMedicine)
};