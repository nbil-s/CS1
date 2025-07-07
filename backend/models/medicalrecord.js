const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user');

const MedicalRecord = sequelize.define('MedicalRecord', {
  diagnosis: {
    type: DataTypes.STRING,
    allowNull: false
  },
  treatment: {
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
MedicalRecord.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
MedicalRecord.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });

module.exports = MedicalRecord; 