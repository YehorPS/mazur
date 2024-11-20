
const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  diagnoses: [{ type: String }],
  treatments: [{ type: String }],
  surgeries: [{ type: String }],
  healthComplaints: [{ type: String }],
  vaccinations: [{ type: String }],
  doctorComments: [{ type: String }],
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
