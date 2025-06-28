const express = require('express');
const { 
  getPendingAppointments, 
  getDoctors, 
  assignDoctor, 
  updateAppointmentStatus 
} = require('../controllers/receptionistController');
const { 
  getQueueManagement, 
  addToQueue, 
  updateQueueStatus, 
  removeFromQueue 
} = require('../controllers/queueController');
const router = express.Router();

// Receptionist appointment management routes
router.get('/appointments', getPendingAppointments);
router.get('/doctors', getDoctors);
router.put('/appointments/:appointmentId/assign', assignDoctor);
router.put('/appointments/:appointmentId', updateAppointmentStatus);

// Receptionist queue management routes
router.get('/queue', getQueueManagement);
router.post('/queue/add', addToQueue);
router.put('/queue/:queueId/status', updateQueueStatus);
router.delete('/queue/:queueId', removeFromQueue);

module.exports = router; 