const sequelize = require('./config/db');

async function dropNotificationsTable() {
  try {
    console.log('Dropping Notifications table...');
    
    // Drop the notifications table
    await sequelize.query('DROP TABLE IF EXISTS `Notifications`');
    
    console.log('Notifications table dropped successfully');
    
    // Close the connection
    await sequelize.close();
    console.log('Database connection closed');
    
  } catch (error) {
    console.error('Error dropping notifications table:', error);
  }
}

dropNotificationsTable(); 