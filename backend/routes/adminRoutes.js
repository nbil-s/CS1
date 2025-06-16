const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Staff management routes
router.post('/staff', adminController.addStaffMember);
router.get('/staff', adminController.getStaffMembers);
router.put('/staff/:userId', adminController.updateStaffMember);

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// System management routes
router.get('/stats', adminController.getSystemStats);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router; 