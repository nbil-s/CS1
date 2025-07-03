const express = require('express');
const { getDoctorAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const router = express.Router();

// Doctor appointment routes
router.get('/appointments', getDoctorAppointments);
router.put('/appointments/:appointmentId', updateAppointmentStatus);

module.exports = router; 