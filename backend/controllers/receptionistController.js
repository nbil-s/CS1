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

// Get all pending appointments (for receptionist)
exports.getPendingAppointments = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { date } = req.query;
      
      console.log('Receptionist requesting appointments for date:', date);
      
      let whereClause = { status: 'pending' };
      if (date) {
        // Use DATE() function for more reliable date comparison
        whereClause.appointmentDate = require('sequelize').literal(`DATE(appointmentDate) = '${date}'`);
      }

      const appointments = await Appointment.findAll({
        where: whereClause,
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'doctor', attributes: ['id', 'name', 'email'] }
        ],
        order: [['appointmentDate', 'ASC'], ['appointmentTime', 'ASC']]
      });

      console.log('Found appointments:', appointments.length);
      res.json({ appointments });
    });
  } catch (error) {
    console.error('Get pending appointments error:', error);
    res.status(500).json({ message: 'Failed to get appointments', error: error.message });
  }
};

// Get all doctors
exports.getDoctors = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const doctors = await User.findAll({
        where: { role: 'doctor' },
        attributes: ['id', 'name', 'email']
      });

      res.json({ doctors });
    });
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Failed to get doctors', error: error.message });
  }
};

// Assign doctor to appointment
exports.assignDoctor = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { appointmentId } = req.params;
      const { doctorId } = req.body;

      if (!doctorId) {
        return res.status(400).json({ message: 'Doctor ID is required' });
      }

      const appointment = await Appointment.findByPk(appointmentId, {
        include: [{ model: User, as: 'patient' }]
      });
      
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      // Verify the doctor exists
      const doctor = await User.findOne({ where: { id: doctorId, role: 'doctor' } });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      await appointment.update({ 
        doctorId,
        status: 'confirmed'
      });

      // Create notification for doctor assignment
      await createNotification(
        appointment.patientId,
        'appointment',
        'Doctor Assigned',
        `Dr. ${doctor.name} has been assigned to your appointment for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime}. Your appointment is now confirmed.`,
        appointment.id,
        'appointment'
      );

      res.json({ 
        message: 'Doctor assigned successfully', 
        appointment 
      });
    });
  } catch (error) {
    console.error('Assign doctor error:', error);
    res.status(500).json({ message: 'Failed to assign doctor', error: error.message });
  }
};

// Update appointment status
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

      await appointment.update({ status });

      // Create notification for status update
      let notificationTitle, notificationMessage;
      switch (status) {
        case 'cancelled':
          notificationTitle = 'Appointment Cancelled';
          notificationMessage = `Your appointment for ${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.appointmentTime} has been cancelled by the receptionist`;
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
        'appointment',
        notificationTitle,
        notificationMessage,
        appointment.id,
        'appointment'
      );

      res.json({ message: 'Appointment status updated', appointment });
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Failed to update appointment status', error: error.message });
  }
}; 