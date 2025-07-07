const sequelize = require('../config/db');
const User = require('./user');
const Appointment = require('./appointment');
const Queue = require('./queue');
const Notification = require('./notification');
const Prescription = require('./prescription');
const MedicalRecord = require('./medicalrecord');

// Define relationships - simplified to reduce foreign key constraints
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'doctorAppointments', foreignKey: 'doctorId' });
Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

// Queue relationships
User.hasMany(Queue, { as: 'patientQueue', foreignKey: 'patientId' });
User.hasMany(Queue, { as: 'doctorQueue', foreignKey: 'doctorId' });
Queue.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Queue.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });
User.hasMany(Queue, { as: 'receptionistQueue', foreignKey: 'receptionistId' });
Queue.belongsTo(User, { as: 'receptionist', foreignKey: 'receptionistId' });

// Notification relationships - simplified
User.hasMany(Notification, { as: 'patientNotifications', foreignKey: 'patientId' });
User.hasMany(Notification, { as: 'doctorNotifications', foreignKey: 'doctorId' });
User.hasMany(Notification, { as: 'receptionistNotifications', foreignKey: 'receptionistId' });
// Remove redundant belongsTo relationships to reduce foreign key constraints

const initModels = async () => {
  try {
    await sequelize.sync({ alter: true }); // auto-create tables
    console.log('Database synced');
  } catch (error) {
    console.error('Database sync error:', error.message);
    // If sync fails, try without alter
    try {
      await sequelize.sync({ force: false });
      console.log('Database synced (without alter)');
    } catch (syncError) {
      console.error('Database sync failed:', syncError.message);
    }
  }
};

module.exports = { initModels, User, Appointment, Queue, Notification, Prescription, MedicalRecord };
