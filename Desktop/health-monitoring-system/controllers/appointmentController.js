
const Appointment = require('../models/Appointment');
const User = require('../models/User');

exports.createAppointment = async (req, res) => {
  const { doctorId, patientId, dateTime } = req.body;
  try {
    const appointment = new Appointment({ doctor: doctorId, patient: patientId, dateTime });
    await appointment.save();
    res.status(201).json({ message: 'Запис на прийом успішно створено' });
  } catch (error) {
    res.status(500).json({ message: 'Помилка при створенні запису на прийом', error });
  }
};

exports.getAppointmentsForDoctor = async (req, res) => {
    try {
      const appointments = await Appointment.find({ doctor: req.user.id });
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: 'Помилка при отриманні записів на прийом', error });
    }
  };
exports.getAppointmentsForPatient = async (req, res) => {
  const { patientId } = req.params;
  try {
    const appointments = await Appointment.find({ patient: patientId });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні записів на прийом', error });
  }
};
