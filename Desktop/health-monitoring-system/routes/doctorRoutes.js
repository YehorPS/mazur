
const express = require('express');
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();


router.get('/dashboard', authMiddleware.verifyToken, doctorController.dashboard);


router.get('/patients', authMiddleware.verifyToken, doctorController.viewPatients);


router.get('/patient/:id/record', authMiddleware.verifyToken, doctorController.viewPatientRecord);


router.post('/patient/:id/record', authMiddleware.verifyToken, doctorController.createPatientRecord);

router.post('/update-profile', authMiddleware.verifyToken, doctorController.updateProfile); 


module.exports = router;
