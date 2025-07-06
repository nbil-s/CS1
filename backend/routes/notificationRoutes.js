const express = require('express');
const { 
  getPatientNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount,
  getDoctorNotifications,
  markDoctorNotificationAsRead,
  getReceptionistNotifications,
  markReceptionistNotificationAsRead
} = require('../controllers/notificationController');

const router = express.Router();

// Debug middleware to log all requests to this router
router.use((req, res, next) => {
  console.log(`[Notifications Router] ${req.method} ${req.path}`);
  next();
});

// Test route to confirm router is loaded
router.get('/test', (req, res) => {
  console.log('[Notifications Router] Test route hit');
  res.json({ message: 'Notifications router is working!' });
});

// Patient notification routes
router.get('/patient', getPatientNotifications);
router.get('/patient/unread-count', getUnreadCount);
router.put('/patient/:notificationId/read', markAsRead);
router.put('/patient/mark-all-read', markAllAsRead);

// Doctor notification routes
router.get('/doctor', getDoctorNotifications);
router.put('/doctor/:notificationId/read', markDoctorNotificationAsRead);

// Receptionist notification routes
router.get('/receptionist', getReceptionistNotifications);
router.put('/receptionist/:notificationId/read', markReceptionistNotificationAsRead);

module.exports = router; 