const sequelize = require('../config/db');
const User = require('./user');

const initModels = async () => {
  await sequelize.sync({ alter: true }); // auto-create tables
  console.log('Database synced');
};

module.exports = { initModels, User };
