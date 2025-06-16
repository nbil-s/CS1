const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Profile routes
router.get('/profile', doctorController.getProfile);
router.put('/profile', doctorController.updateProfile);

// Appointment routes
router.get('/appointments', doctorController.getAppointments);
router.put('/appointments/:appointmentId', doctorController.updateAppointmentStatus);

// Queue management routes
router.get('/queue', doctorController.getQueue);
router.post('/queue/call-next', doctorController.callNextPatient);
router.put('/queue/:queueId/complete', doctorController.completeConsultation);

// Schedule routes
router.get('/schedule', doctorController.getSchedule);

module.exports = router; 