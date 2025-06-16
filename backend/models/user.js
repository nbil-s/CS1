const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: { 
    type: DataTypes.STRING, 
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  passwordHash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: { 
    type: DataTypes.ENUM('patient', 'receptionist', 'doctor', 'admin'),
    allowNull: false,
    defaultValue: 'patient'
  },
  // Additional fields for staff members
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Doctor-specific fields
  specialization: {
    type: DataTypes.STRING,
    allowNull: true
  },
  licenseNumber: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Receptionist-specific fields
  department: {
    type: DataTypes.STRING,
    allowNull: true
  },
  // Common fields
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  // Admin audit fields
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['role']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = User;
