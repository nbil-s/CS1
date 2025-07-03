const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Notification = sequelize.define('Notification', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('appointment', 'queue', 'prescription', 'reminder', 'system'),
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  relatedId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID of related entity (appointment, queue, prescription, etc.)'
  },
  relatedType: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Type of related entity (appointment, queue, prescription, etc.)'
  }
});

module.exports = Notification; 