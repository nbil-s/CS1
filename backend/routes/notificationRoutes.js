const express = require('express');
const { 
  getPatientNotifications, 
  markAsRead, 
  markAllAsRead, 
  getUnreadCount 
} = require('../controllers/notificationController');
const router = express.Router();

// Patient notification routes
router.get('/patient', getPatientNotifications);
router.get('/patient/unread-count', getUnreadCount);
router.put('/patient/:notificationId/read', markAsRead);
router.put('/patient/mark-all-read', markAllAsRead);

module.exports = router; 