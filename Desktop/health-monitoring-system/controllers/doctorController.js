// controllers/doctorController.js
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');

exports.dashboard = async (req, res) => {
  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Лікар не знайдений' });
    }

    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні профілю лікаря', error });
  }
};

exports.viewPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні пацієнтів', error });
  }
};

exports.updateProfile = async (req, res) => {
  const { email, phone, specialty, photo } = req.body;

  try {
    const doctor = await User.findById(req.user.id);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Лікар не знайдений' });
    }

    if (email) doctor.email = email;
    if (phone) doctor.phone = phone;
    if (specialty) doctor.specialty = specialty;
    if (photo) doctor.photo = photo;

    await doctor.save();
    res.json({ message: 'Профіль успішно оновлено', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при оновленні профілю', error });
  }
};
exports.viewPatientRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findOne({ user: req.params.id });
    if (!record) {
      return res.status(404).json({ message: 'Медична картка не знайдена' });
    }
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні медичної картки', error });
  }
};

exports.createPatientRecord = async (req, res) => {
  try {
    const { diagnoses, treatments, surgeries, healthComplaints, vaccinations } = req.body;
    const record = new MedicalRecord({
      user: req.params.id,
      diagnoses,
      treatments,
      surgeries,
      healthComplaints,
      vaccinations,
      doctorComments: [`Запис створено лікарем ${req.user.fullName}`],
    });

    await record.save();
    res.status(201).json({ message: 'Запис успішно створено', record });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при створенні запису', error });
  }
};
