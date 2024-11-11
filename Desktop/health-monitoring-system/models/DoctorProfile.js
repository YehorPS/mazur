// models/DoctorProfile.js
const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photo: { type: String, default: '' }, // Додаємо значення за замовчуванням
  specialization: { type: String, required: true },
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' }],
}, { timestamps: true });

module.exports = mongoose.model('DoctorProfile', doctorProfileSchema);
