const { Queue, User } = require('../models');
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

// Get current queue (for patients to check their position)
exports.getCurrentQueue = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const queue = await Queue.findAll({
        where: { status: ['waiting', 'called'] },
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name'] },
          { model: User, as: 'doctor', attributes: ['id', 'name'] },
          { model: User, as: 'receptionist', attributes: ['id', 'name'] }
        ],
        order: [['queueNumber', 'ASC']]
      });

      // Find patient's position
      const patientPosition = queue.findIndex(item => item.patientId === req.user.id);
      const patientQueue = patientPosition >= 0 ? queue[patientPosition] : null;

      res.json({ 
        queue,
        currentPatient: patientQueue,
        position: patientPosition >= 0 ? patientPosition + 1 : null,
        totalWaiting: queue.filter(item => item.status === 'waiting').length
      });
    });
  } catch (error) {
    console.error('Get queue error:', error);
    res.status(500).json({ message: 'Failed to get queue', error: error.message });
  }
};

// Add patient to queue (receptionist)
exports.addToQueue = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { patientId, doctorId, priority, notes } = req.body;

      // Validate patientId
      const patient = await User.findByPk(patientId);
      if (!patient) {
        return res.status(400).json({ message: 'Invalid patientId: user does not exist' });
      }

      // Handle empty doctorId - set to null if empty string or undefined
      const validDoctorId = doctorId && doctorId !== '' ? doctorId : null;

      // Get next queue number
      const lastQueue = await Queue.findOne({
        order: [['queueNumber', 'DESC']]
      });
      const nextNumber = (lastQueue?.queueNumber || 0) + 1;

      // Calculate estimated wait time (15 minutes per person ahead)
      const waitingCount = await Queue.count({
        where: { status: 'waiting' }
      });
      const estimatedWait = waitingCount * 15;

      const queueEntry = await Queue.create({
        patientId,
        doctorId: validDoctorId,
        receptionistId: req.user.id, // Record the receptionist who added the patient
        queueNumber: nextNumber,
        priority,
        estimatedWaitTime: estimatedWait,
        notes
      });

      // Create notification for patient
      await createNotification(
        patientId,
        'patient',
        'queue',
        'Added to Queue',
        `You have been added to the queue with number ${nextNumber}. Estimated wait time: ${estimatedWait} minutes.`,
        queueEntry.id,
        'queue'
      );

      res.status(201).json({ 
        message: 'Patient added to queue', 
        queueEntry 
      });
    });
  } catch (error) {
    console.error('Add to queue error:', error);
    res.status(500).json({ message: 'Failed to add to queue', error: error.message });
  }
};

// Add patient to queue (self-service, patient)
exports.createQueue = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { doctorId, priority, notes } = req.body;
      const patientId = req.user.id;

      // Handle empty doctorId - set to null if empty string or undefined
      const validDoctorId = doctorId && doctorId !== '' ? doctorId : null;

      // Get next queue number
      const lastQueue = await Queue.findOne({
        order: [['queueNumber', 'DESC']]
      });
      const nextNumber = (lastQueue?.queueNumber || 0) + 1;

      // Calculate estimated wait time (15 minutes per person ahead)
      const waitingCount = await Queue.count({ where: { status: 'waiting' } });
      const estimatedWait = waitingCount * 15;

      const queueEntry = await Queue.create({
        patientId,
        doctorId: validDoctorId,
        queueNumber: nextNumber,
        priority,
        estimatedWaitTime: estimatedWait,
        notes
      });

      // Create notification for patient
      await createNotification(
        patientId,
        'patient',
        'queue',
        'Added to Queue',
        `You have been added to the queue with number ${nextNumber}. Estimated wait time: ${estimatedWait} minutes.`,
        queueEntry.id,
        'queue'
      );

      res.status(201).json({
        message: 'You have been added to the queue',
        queueEntry
      });
    });
  } catch (error) {
    console.error('Patient add to queue error:', error);
    res.status(500).json({ message: 'Failed to join queue', error: error.message });
  }
};

// Update queue status (receptionist/doctor)
exports.updateQueueStatus = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { queueId } = req.params;
      const { status } = req.body;

      const queueEntry = await Queue.findByPk(queueId, {
        include: [{ model: User, as: 'patient' }]
      });
      
      if (!queueEntry) {
        return res.status(404).json({ message: 'Queue entry not found' });
      }

      await queueEntry.update({ status });

      // Create notification for status change
      let notificationTitle, notificationMessage;
      switch (status) {
        case 'called':
          notificationTitle = 'Your Turn!';
          notificationMessage = `Queue number ${queueEntry.queueNumber}: Please proceed to see the doctor.`;
          break;
        case 'in-consultation':
          notificationTitle = 'Consultation Started';
          notificationMessage = `Your consultation has begun. Queue number: ${queueEntry.queueNumber}`;
          break;
        case 'completed':
          notificationTitle = 'Consultation Completed';
          notificationMessage = `Your consultation has been completed. Thank you for visiting!`;
          break;
        case 'cancelled':
          notificationTitle = 'Queue Cancelled';
          notificationMessage = `Your queue entry (number ${queueEntry.queueNumber}) has been cancelled.`;
          break;
        default:
          notificationTitle = 'Queue Status Updated';
          notificationMessage = `Your queue status has been updated to: ${status}`;
      }

      await createNotification(
        queueEntry.patientId,
        'patient',
        'queue',
        notificationTitle,
        notificationMessage,
        queueEntry.id,
        'queue'
      );

      res.json({ message: 'Queue status updated', queueEntry });
    });
  } catch (error) {
    console.error('Update queue status error:', error);
    res.status(500).json({ message: 'Failed to update queue status', error: error.message });
  }
};

// Get queue management view (receptionist)
exports.getQueueManagement = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const queue = await Queue.findAll({
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'email'] },
          { model: User, as: 'doctor', attributes: ['id', 'name'] }
        ],
        order: [['queueNumber', 'ASC']]
      });

      res.json({ queue });
    });
  } catch (error) {
    console.error('Get queue management error:', error);
    res.status(500).json({ message: 'Failed to get queue', error: error.message });
  }
};

// Remove from queue (receptionist)
exports.removeFromQueue = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { queueId } = req.params;

      const queueEntry = await Queue.findByPk(queueId, {
        include: [{ model: User, as: 'patient' }]
      });
      
      if (!queueEntry) {
        return res.status(404).json({ message: 'Queue entry not found' });
      }

      // Create notification before removing
      await createNotification(
        queueEntry.patientId,
        'patient',
        'queue',
        'Removed from Queue',
        `You have been removed from the queue (number ${queueEntry.queueNumber}).`,
        queueEntry.id,
        'queue'
      );

      await queueEntry.destroy();
      res.json({ message: 'Patient removed from queue' });
    });
  } catch (error) {
    console.error('Remove from queue error:', error);
    res.status(500).json({ message: 'Failed to remove from queue', error: error.message });
  }
}; 

// Get doctor's queue (for doctors to see their patients)
exports.getDoctorQueue = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const doctorId = req.user.id;
      
      const queue = await Queue.findAll({
        where: { 
          doctorId: doctorId,
          status: ['waiting', 'called', 'in-consultation']
        },
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'email'] }
        ],
        order: [['queueNumber', 'ASC']]
      });

      // Calculate queue position for each patient
      const queueWithPosition = queue.map((item, index) => ({
        ...item.toJSON(),
        position: index + 1
      }));

      res.json({ 
        queue: queueWithPosition,
        totalWaiting: queue.filter(item => item.status === 'waiting').length,
        totalCalled: queue.filter(item => item.status === 'called').length,
        totalInConsultation: queue.filter(item => item.status === 'in-consultation').length
      });
    });
  } catch (error) {
    console.error('Get doctor queue error:', error);
    res.status(500).json({ message: 'Failed to get doctor queue', error: error.message });
  }
};

// Get patient's queue status (for patients to check their position)
exports.getPatientQueueStatus = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const patientId = req.user.id;
      
      const patientQueue = await Queue.findOne({
        where: { 
          patientId: patientId,
          status: ['waiting', 'called', 'in-consultation']
        },
        include: [
          { model: User, as: 'doctor', attributes: ['id', 'name'] }
        ]
      });

      if (!patientQueue) {
        return res.json({ 
          inQueue: false,
          message: 'You are not currently in the queue'
        });
      }

      // Get total queue to calculate position
      const totalQueue = await Queue.findAll({
        where: { status: ['waiting', 'called', 'in-consultation'] },
        order: [['queueNumber', 'ASC']]
      });

      const position = totalQueue.findIndex(item => item.id === patientQueue.id) + 1;

      res.json({
        inQueue: true,
        queueEntry: patientQueue,
        position: position,
        totalWaiting: totalQueue.filter(item => item.status === 'waiting').length,
        estimatedWaitTime: patientQueue.estimatedWaitTime
      });
    });
  } catch (error) {
    console.error('Get patient queue status error:', error);
    res.status(500).json({ message: 'Failed to get queue status', error: error.message });
  }
};

// Get detailed queue information for receptionist
exports.getDetailedQueue = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const queue = await Queue.findAll({
        include: [
          { model: User, as: 'patient', attributes: ['id', 'name', 'email', 'phone'] },
          { model: User, as: 'doctor', attributes: ['id', 'name'] }
        ],
        order: [['queueNumber', 'ASC']]
      });

      // Calculate position and wait time for each entry
      const queueWithDetails = queue.map((item, index) => {
        const waitingAhead = queue.slice(0, index).filter(q => q.status === 'waiting').length;
        return {
          ...item.toJSON(),
          position: index + 1,
          estimatedWaitTime: waitingAhead * 15 // 15 minutes per person ahead
        };
      });

      const stats = {
        total: queue.length,
        waiting: queue.filter(item => item.status === 'waiting').length,
        called: queue.filter(item => item.status === 'called').length,
        inConsultation: queue.filter(item => item.status === 'in-consultation').length,
        completed: queue.filter(item => item.status === 'completed').length
      };

      res.json({ 
        queue: queueWithDetails,
        stats
      });
    });
  } catch (error) {
    console.error('Get detailed queue error:', error);
    res.status(500).json({ message: 'Failed to get detailed queue', error: error.message });
  }
}; 