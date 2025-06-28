const { Queue, User } = require('../models');

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

      const queueEntry = await Queue.findByPk(queueId);
      
      if (!queueEntry) {
        return res.status(404).json({ message: 'Queue entry not found' });
      }

      await queueEntry.update({ status });
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

      const queueEntry = await Queue.findByPk(queueId);
      
      if (!queueEntry) {
        return res.status(404).json({ message: 'Queue entry not found' });
      }

      await queueEntry.destroy();
      res.json({ message: 'Patient removed from queue' });
    });
  } catch (error) {
    console.error('Remove from queue error:', error);
    res.status(500).json({ message: 'Failed to remove from queue', error: error.message });
  }
}; 