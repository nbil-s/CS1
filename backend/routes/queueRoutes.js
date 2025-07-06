const express = require('express');
const { 
  getCurrentQueue, 
  addToQueue, 
  updateQueueStatus, 
  getQueueManagement, 
  removeFromQueue, 
  createQueue,
  getDoctorQueue,
  getPatientQueueStatus,
  getDetailedQueue
} = require('../controllers/queueController');
const router = express.Router();

// Patient queue routes
router.get('/current', getCurrentQueue);
router.get('/status', getPatientQueueStatus);
router.post('/', createQueue);

// Doctor queue routes
router.get('/doctor', getDoctorQueue);

// Receptionist queue management routes
router.get('/management', getQueueManagement);
router.get('/detailed', getDetailedQueue);
router.post('/add', addToQueue);
router.put('/:queueId/status', updateQueueStatus);
router.delete('/:queueId', removeFromQueue);

module.exports = router; 