const express = require('express');
const { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  getSystemStats,
  getAuditLogs 
} = require('../controllers/adminController');
const router = express.Router();

// Admin routes
router.get('/users', getAllUsers);
router.put('/users/:userId', updateUser);
router.delete('/users/:userId', deleteUser);
router.get('/stats', getSystemStats);
router.get('/audit-logs', getAuditLogs);

module.exports = router; 