const jwt = require('jsonwebtoken');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');
const Appointment = require('../models/Appointment');
const { ObjectId } = require('mongoose').Types;  


  

  exports.dashboard = async (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];  
    if (!token) {
      return res.status(403).json({ message: 'Токен не надано' });
    }
  
    try {
      const decodedToken = jwt.verify(token, 'secretKey');  
      const doctorId = decodedToken.id;  
      const doctor = await User.findById(doctorId);
  
      if (!doctor || doctor.role !== 'doctor') {
        return res.status(404).json({ message: 'Лікар не знайдений' });
      }
  
      res.json({ doctor });
    } catch (error) {
      return res.status(500).json({ message: 'Помилка при перевірці токену', error });
    }
  };
  


  exports.viewPatients = async (req, res) => {
    try {
      
      const patients = await User.find({ role: 'patient' }, 'fullName email phone');
      res.json(patients);
    } catch (error) {
      res.status(500).json({ message: 'Помилка при отриманні пацієнтів', error });
    }
  };
  


exports.viewPatientProfile = async (req, res) => {
  try {
    const patientId = req.params.id;

    if (!ObjectId.isValid(patientId)) {
      return res.status(400).json({ message: 'Невірний формат ID пацієнта' });
    }

    const patient = await User.findById(patientId);

    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Пацієнт не знайдений' });
    }

    const medicalRecords = await MedicalRecord.find({ user: patient._id });

    res.json({ patient, medicalRecords });
  } catch (error) {
    console.error('Error while fetching patient profile:', error);
    res.status(500).json({ message: 'Помилка при отриманні профілю пацієнта', error });
  }
};

exports.updatePatientProfileByDoctor = async (req, res) => {
  try {
    const { fullName, phone, email } = req.body;
    const patientId = req.params.id;

    const patient = await User.findById(patientId);
    if (!patient || patient.role !== 'patient') {
      return res.status(404).json({ message: 'Пацієнт не знайдений' });
    }

    
    if (fullName) patient.fullName = fullName;
    if (phone) patient.phone = phone;
    if (email) patient.email = email;

    await patient.save();
    res.status(200).json({ message: 'Профіль пацієнта успішно оновлено', patient });
  } catch (error) {
    console.error('Помилка при оновленні профілю пацієнта:', error);
    res.status(500).json({ message: 'Помилка при оновленні профілю пацієнта' });
  }
};
exports.getDoctorList = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }, 'fullName specialty'); // Отримуємо всіх лікарів
    res.status(200).json(doctors);
  } catch (error) {
    console.error('Помилка під час отримання списку лікарів:', error);
    res.status(500).json({ message: 'Помилка під час отримання списку лікарів' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    
    const doctorId = req.user.id;

    if (!doctorId) {
      return res.status(400).json({ message: 'Не вдалося знайти ідентифікатор лікаря' });
    }

    
    const appointments = await Appointment.find({ doctorId }).populate('patientId', 'fullName email phone');

    if (!appointments.length) {
      return res.status(404).json({ message: 'Записи не знайдено' });
    }

    res.json({ appointments });
  } catch (error) {
    console.error('Помилка при отриманні записів до лікаря:', error);
    res.status(500).json({ message: 'Помилка при отриманні записів', error });
  }
};



exports.updateProfile = async (req, res) => {
  const { email, phone, fullName, dateOfBirth, rank, photo } = req.body;

  try {
    
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'doctor') {
      return res.status(404).json({ message: 'Пацієнт не знайдений' });
    }

    
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (fullName) user.fullName = fullName;
    if (dateOfBirth) user.dateOfBirth = dateOfBirth;
    if (rank) user.rank = rank;
    if (photo) user.photo = photo;

    await user.save();
    res.json({ message: 'Профіль успішно оновлено', user });
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
exports.createMedicalRecord = async (req, res) => {
  try {
    const { diagnoses, treatments, surgeries, healthComplaints, vaccinations } = req.body;

    
    console.log("Шукаємо медичний запис для користувача з ID:", req.params.id);

   
    let record = await MedicalRecord.findOne({ user: req.params.id });

    
    console.log("Знайдений запис:", record);

    
    if (req.user) {
      console.log("Інформація про лікаря:", req.user.fullName);
    } else {
      console.log("Інформація про лікаря не знайдена в `req.user`");
    }

    
    const doctorName = req.user && req.user.fullName ? req.user.fullName : 'Лікар (ім\'я не знайдено)';
    
    if (record) {
      
      if (diagnoses) {
        record.diagnoses.push(diagnoses);
      }
      if (treatments) {
        record.treatments.push(treatments);
      }
      if (surgeries) {
        record.surgeries.push(surgeries);
      }
      if (healthComplaints) {
        record.healthComplaints.push(healthComplaints);
      }
      if (vaccinations) {
        record.vaccinations.push(vaccinations);
      }

      
      record.doctorComments.push(` ${doctorName} `);

      
      await record.save();
      res.status(200).json({ message: 'Запис успішно оновлено', record });
    } else {
      
      record = new MedicalRecord({
        user: req.params.id,
        diagnoses: diagnoses ? [diagnoses] : [],
        treatments: treatments ? [treatments] : [],
        surgeries: surgeries ? [surgeries] : [],
        healthComplaints: healthComplaints ? [healthComplaints] : [],
        vaccinations: vaccinations ? [vaccinations] : [],
        doctorComments: [`Запис створено лікарем ${doctorName}`]
      });

      await record.save();
      res.status(201).json({ message: 'Новий медичний запис створено', record });
    }

  } catch (error) {
    console.error('Помилка при створенні або оновленні запису:', error);
    res.status(500).json({ message: 'Помилка при створенні або оновленні запису', error });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' });  
    res.json(doctors); 
  } catch (error) {
    res.status(500).json({ message: 'Помилка при отриманні лікарів', error });
  }
};
