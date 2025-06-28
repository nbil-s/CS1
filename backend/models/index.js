const sequelize = require('../config/db');
const User = require('./user');
const Appointment = require('./appointment');
const Queue = require('./queue');
const Notification = require('./notification');

// Define relationships
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'doctorAppointments', foreignKey: 'doctorId' });
Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

// Queue relationships
User.hasMany(Queue, { as: 'patientQueue', foreignKey: 'patientId' });
User.hasMany(Queue, { as: 'doctorQueue', foreignKey: 'doctorId' });
Queue.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Queue.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

// Notification relationships
User.hasMany(Notification, { as: 'notifications', foreignKey: 'patientId' });
Notification.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });

const initModels = async () => {
  await sequelize.sync({ alter: true }); // auto-create tables
  console.log('Database synced');
};

module.exports = { initModels, User, Appointment, Queue, Notification };
