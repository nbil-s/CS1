const express = require('express');
const { createAppointment, getPatientAppointments } = require('../controllers/appointmentController');
const router = express.Router();

// Patient appointment routes
router.post('/appointments', createAppointment);
router.get('/appointments', getPatientAppointments);

// Placeholder routes for other patient functionality
router.get('/queue', (req, res) => {
  // TODO: Implement actual queue fetching logic
  res.json({ queue: [] });
});

module.exports = router; 