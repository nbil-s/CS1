const { Appointment, User } = require('../models');
const { createNotification } = require('./notificationController');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Create new appointment (for patients)
exports.createAppointment = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { appointmentDate, appointmentTime, reason } = req.body;
      
      if (!appointmentDate || !appointmentTime) {
        return res.status(400).json({ message: 'Date and time are required' });
      }

      const appointment = await Appointment.create({
        patientId: req.user.id,
        appointmentDate,
        appointmentTime,
        reason,
        status: 'pending'
      });

      // Create notification for appointment creation
      await createNotification(
        req.user.id,
        'patient',
        'appointment',
        'Appointment Booked',
        `Your appointment has been booked for ${new Date(appointmentDate).toLocaleDateString()} at ${appointmentTime}. Status: Pending`,
        appointment.id,
        'appointment'
      );

      res.status(201).json({ 
        message: 'Appointment created successfully', 
        appointment 
      });
    });
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Failed to create appointment', error: error.message });
  }
};

// Get appointments for a patient
exports.getPatientAppointments = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const appointments = await Appointment.findAll({
        where: { patientId: req.user.id },
        include: [
          { model: User, as: 'doctor', attributes: ['id', 'name', 'email'] }
        ],
        order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
      });

      res.json({ appointments });
    });
  } catch (error) {
    console.error('Get patient appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

// Get appointments for a doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const appointments = await Appointment.findAll({
        where: { doctorId: req.user.id },
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'email'] }
        ],
        order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
      });

      res.json({ appointments });
    });
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

// Update appointment status (for doctors)
exports.updateAppointmentStatus = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { appointmentId } = req.params;
      const { status } = req.body;

      const appointment = await Appointment.findByPk(appointmentId, {
        include: [{ model: User, as: 'patient' }]
      });
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (appointment.doctorId !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this appointment' });
      }

      await appointment.update({ status });

      // Create notification for appointment status update
      let notificationTitle, notificationMessage;
      switch (status) {
        case 'confirmed':
          notificationTitle = 'Appointment Confirmed';
          notificationMessage = `Your appointment for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been confirmed by Dr. ${req.user.name}`;
          break;
        case 'cancelled':
          notificationTitle = 'Appointment Cancelled';
          notificationMessage = `Your appointment for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been cancelled`;
          break;
        case 'completed':
          notificationTitle = 'Appointment Completed';
          notificationMessage = `Your appointment for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been marked as completed`;
          break;
        default:
          notificationTitle = 'Appointment Updated';
          notificationMessage = `Your appointment status has been updated to: ${status}`;
      }

      await createNotification(
        appointment.patientId,
        'patient',
        'appointment',
        notificationTitle,
        notificationMessage,
        appointment.id,
        'appointment'
      );

      res.json({ message: 'Appointment status updated', appointment });
    });
  } catch (error) {
    console.error('Update appointment error:', error);
    res.status(500).json({ message: 'Failed to update appointment', error: error.message });
  }
}; 