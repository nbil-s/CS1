const express = require('express');
const { 
  getCurrentQueue, 
  addToQueue, 
  updateQueueStatus, 
  getQueueManagement, 
  removeFromQueue 
} = require('../controllers/queueController');
const router = express.Router();

// Patient queue routes
router.get('/current', getCurrentQueue);

// Receptionist queue management routes
router.get('/management', getQueueManagement);
router.post('/add', addToQueue);
router.put('/:queueId/status', updateQueueStatus);
router.delete('/:queueId', removeFromQueue);

module.exports = router; 