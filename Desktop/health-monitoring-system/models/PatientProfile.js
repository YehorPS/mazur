const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  photo: { type: String },  
  medicalCard: { type: mongoose.Schema.Types.ObjectId, ref: 'MedicalCard' },
}, { timestamps: true });

module.exports = mongoose.model('PatientProfile', patientProfileSchema);
