// controllers/medicalRecordController.js
const MedicalRecord = require('../models/MedicalRecord');
const User = require('../models/User');

exports.createRecord = async (req, res) => {
  const { userId, diagnoses, treatments, surgeries, healthComplaints, vaccinations, doctorComments } = req.body;
  try {
    const medicalRecord = new MedicalRecord({
      user: userId,
      diagnoses,
      treatments,
      surgeries,
      healthComplaints,
      vaccinations,
      doctorComments,
    });
    await medicalRecord.save();
    res.status(201).json({ message: 'Медична картка створена' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при створенні медичної картки', error });
  }
};

exports.getRecord = async (req, res) => {
  const { userId } = req.params;
  try {
    const record = await MedicalRecord.findOne({ user: userId });
    if (!record) {
      return res.status(404).json({ message: 'Медична картка не знайдена' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні медичної картки', error });
  }
};
