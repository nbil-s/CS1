const express = require('express');
const { createAppointment, getPatientAppointments } = require('../controllers/appointmentController');
const { getCurrentQueue } = require('../controllers/queueController');
const router = express.Router();

// Patient appointment routes
router.post('/appointments', createAppointment);
router.get('/appointments', getPatientAppointments);

// Patient queue routes
router.get('/queue', getCurrentQueue);

module.exports = router; 