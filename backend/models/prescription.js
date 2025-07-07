const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const Prescription = sequelize.define('Prescription', {
  medication: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  doctorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true
});

// Associations
Prescription.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
Prescription.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });

module.exports = Prescription; 