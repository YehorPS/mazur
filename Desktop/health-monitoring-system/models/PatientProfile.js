const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  photo: { type: String },
  rank: { type: String },
  medicalCard: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalCard' },
}, { timestamps: true });

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
