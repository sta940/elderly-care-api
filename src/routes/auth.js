import UserController from '../controllers/UserController.js'
import MetricController from "../controllers/MetricController";
import MedicineController from "../controllers/MedicineController";
import ReminderController from "../controllers/ReminderController";
import SurveyController from "../controllers/SurveyController";

export default (app) => {
    app.get('/user', UserController.userInfo);
    app.delete('/removeUser', UserController.deleteUser);

    app.post('/metric', MetricController.addMetric);
    app.post('/metrics', MetricController.getMetrics);
    app.put('/metric', MetricController.changeMetric);
    app.delete('/metric', MetricController.deleteMetric);

    app.post('/medicine', MedicineController.addMedicine);
    app.post('/medicines', MedicineController.getMedicines);
    app.put('/medicine', MedicineController.changeMedicine)
    app.delete('/medicine', MedicineController.deleteMedicine)

    app.post('/reminder', ReminderController.addReminder);
    app.post('/reminders', ReminderController.getReminders);
    app.put('/reminder', ReminderController.changeReminder)
    app.delete('/reminder', ReminderController.deleteReminder)
    app.post('/importReminders', ReminderController.uploadFile)

    app.post('/survey', SurveyController.getSurveyResult);
    app.get('/survey', SurveyController.getSurvey);
};