const { User, Appointment, Queue, Notification } = require('../models');

// Middleware to verify JWT token and doctor role
const verifyDoctorToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.role !== 'doctor') {
      return res.status(403).json({ message: 'Doctor access required' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get doctor's profile
exports.getProfile = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const doctor = await User.findByPk(req.user.id, {
        attributes: { exclude: ['passwordHash'] }
      });
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      res.json({ doctor });
    });
  } catch (error) {
    console.error('Get doctor profile error:', error);
    res.status(500).json({ message: 'Failed to get profile', error: error.message });
  }
};

// Update doctor's profile
exports.updateProfile = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const { name, phone, specialization, licenseNumber } = req.body;
      
      const doctor = await User.findByPk(req.user.id);
      
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }
      
      const updateData = {};
      if (name) updateData.name = name;
      if (phone) updateData.phone = phone;
      if (specialization) updateData.specialization = specialization;
      if (licenseNumber) updateData.licenseNumber = licenseNumber;
      
      await doctor.update(updateData);
      
      res.json({ 
        message: 'Profile updated successfully',
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          phone: doctor.phone,
          specialization: doctor.specialization,
          licenseNumber: doctor.licenseNumber
        }
      });
    });
  } catch (error) {
    console.error('Update doctor profile error:', error);
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};

// Get doctor's appointments
exports.getAppointments = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const { status, date } = req.query;
      
      const whereClause = { doctorId: req.user.id };
      
      if (status) {
        whereClause.status = status;
      }
      
      if (date) {
        whereClause.date = date;
      }
      
      const appointments = await Appointment.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'email', 'phone'] }
        ],
        order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
      });
      
      res.json({ appointments });
    });
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

// Update appointment status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const { appointmentId } = req.params;
      const { status, notes } = req.body;
      
      const appointment = await Appointment.findOne({
        where: { id: appointmentId, doctorId: req.user.id }
      });
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }
      
      const updateData = {};
      if (status) updateData.status = status;
      if (notes) updateData.notes = notes;
      
      await appointment.update(updateData);
      
      // Create notification for patient
      if (status === 'completed' || status === 'cancelled') {
        await Notification.create({
          userId: appointment.patientId,
          title: `Appointment ${status}`,
          message: `Your appointment on ${appointment.date} has been ${status}.`,
          type: 'appointment',
          isRead: false
        });
      }
      
      res.json({ 
        message: 'Appointment updated successfully',
        appointment
      });
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
};

// Get doctor's queue
exports.getQueue = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const queue = await Queue.findAll({
        where: { 
          doctorId: req.user.id,
          status: ['waiting', 'called']
        },
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'phone'] }
        ],
        order: [['createdAt', 'ASC']]
      });
      
      res.json({ queue });
    });
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ message: 'Failed to get queue', error: error.message });
  }
};

// Call next patient
exports.callNextPatient = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const nextPatient = await Queue.findOne({
        where: { 
          doctorId: req.user.id,
          status: 'waiting'
        },
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'phone'] }
        ],
        order: [['createdAt', 'ASC']]
      });
      
      if (!nextPatient) {
        return res.status(404).json({ message: 'No patients waiting in queue' });
      }
      
      await nextPatient.update({ status: 'called' });
      
      // Create notification for patient
      await Notification.create({
        userId: nextPatient.patientId,
        title: 'Your turn',
        message: `Dr. ${req.user.name} is ready to see you.`,
        type: 'queue',
        isRead: false
      });
      
      res.json({ 
        message: 'Patient called successfully',
        patient: nextPatient
      });
    });
  } catch (error) {
    console.error('Call next patient error:', error);
    res.status(500).json({ message: 'Failed to call next patient', error: error.message });
  }
};

// Complete patient consultation
exports.completeConsultation = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const { queueId } = req.params;
      const { notes, prescription } = req.body;
      
      const queueEntry = await Queue.findOne({
        where: { id: queueId, doctorId: req.user.id }
      });
      
      if (!queueEntry) {
        return res.status(404).json({ message: 'Queue entry not found' });
      }
      
      await queueEntry.update({ 
        status: 'completed',
        notes: notes || queueEntry.notes,
        prescription: prescription || queueEntry.prescription
      });
      
      res.json({ 
        message: 'Consultation completed successfully',
        queueEntry
      });
    });
  } catch (error) {
    console.error('Complete consultation error:', error);
    res.status(500).json({ message: 'Failed to complete consultation', error: error.message });
  }
};

// Get doctor's schedule
exports.getSchedule = async (req, res) => {
  try {
    verifyDoctorToken(req, res, async () => {
      const { date } = req.query;
      
      const whereClause = { doctorId: req.user.id };
      
      if (date) {
        whereClause.date = date;
      }
      
      const schedule = await Appointment.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'phone'] }
        ],
        order: [['date', 'ASC'], ['time', 'ASC']]
      });
      
      res.json({ schedule });
    });
  } catch (error) {
    console.error('Get schedule error:', error);
    res.status(500).json({ message: 'Failed to get schedule', error: error.message });
  }
}; 

// Get all doctors (for patients to select from)
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.findAll({
      where: { 
        role: 'doctor',
        isActive: true
      },
      attributes: ['id', 'name', 'specialization', 'email'],
      order: [['name', 'ASC']]
    });
    
    res.json({ doctors });
  } catch (error) {
    console.error('Get all doctors error:', error);
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
}; 