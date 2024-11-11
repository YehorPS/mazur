// routes/appointmentRoutes.js
const express = require('express');
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware.verifyToken, appointmentController.createAppointment);
router.get('/doctor/:doctorId', authMiddleware.verifyToken, appointmentController.getAppointmentsForDoctor);
router.get('/patient/:patientId', authMiddleware.verifyToken, appointmentController.getAppointmentsForPatient);

module.exports = router;
