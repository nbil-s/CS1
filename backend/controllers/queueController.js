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
          { model: User, as: 'doctor', attributes: ['id', 'name'] }
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
        doctorId,
        queueNumber: nextNumber,
        priority,
        estimatedWaitTime: estimatedWait,
        notes
      });

      // Create notification for patient
      await createNotification(
        patientId,
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