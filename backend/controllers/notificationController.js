const { Notification, User } = require('../models');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get notifications for a patient
exports.getPatientNotifications = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const notifications = await Notification.findAll({
        where: { patientId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit: 50 // Limit to last 50 notifications
      });

      res.json({ notifications });
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Failed to get notifications', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const { notificationId } = req.params;

      const notification = await Notification.findOne({
        where: { id: notificationId, patientId: req.user.id }
      });

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }

      await notification.update({ read: true });
      res.json({ message: 'Notification marked as read', notification });
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    res.status(500).json({ message: 'Failed to mark notification as read', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      await Notification.update(
        { read: true },
        { where: { patientId: req.user.id, read: false } }
      );

      res.json({ message: 'All notifications marked as read' });
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    res.status(500).json({ message: 'Failed to mark notifications as read', error: error.message });
  }
};

// Create a new notification (for internal use)
exports.createNotification = async (patientId, type, title, message, relatedId = null, relatedType = null) => {
  try {
    const notification = await Notification.create({
      patientId,
      type,
      title,
      message,
      relatedId,
      relatedType
    });
    return notification;
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

// Get unread notification count
exports.getUnreadCount = async (req, res) => {
  try {
    verifyToken(req, res, async () => {
      const count = await Notification.count({
        where: { patientId: req.user.id, read: false }
      });

      res.json({ unreadCount: count });
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Failed to get unread count', error: error.message });
  }
}; 