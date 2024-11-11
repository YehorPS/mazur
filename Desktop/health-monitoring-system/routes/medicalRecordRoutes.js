// routes/medicalRecordRoutes.js
const express = require('express');
const medicalRecordController = require('../controllers/medicalRecordController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/create', authMiddleware.verifyToken, medicalRecordController.createRecord);
router.get('/user/:userId', authMiddleware.verifyToken, medicalRecordController.getRecord);

module.exports = router;
