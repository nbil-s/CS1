const sequelize = require('../config/db');
const User = require('./user');
const Appointment = require('./appointment');

// Define relationships
User.hasMany(Appointment, { as: 'patientAppointments', foreignKey: 'patientId' });
User.hasMany(Appointment, { as: 'doctorAppointments', foreignKey: 'doctorId' });
Appointment.belongsTo(User, { as: 'patient', foreignKey: 'patientId' });
Appointment.belongsTo(User, { as: 'doctor', foreignKey: 'doctorId' });

const initModels = async () => {
  await sequelize.sync({ alter: true }); // auto-create tables
  console.log('Database synced');
};

module.exports = { initModels, User, Appointment };
