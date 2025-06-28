const { Sequelize } = require('sequelize');
require('dotenv').config();

// Create connection to the specific database
const sequelize = new Sequelize(
  'Queue Management', // Explicitly use the database name
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: true, // Enable logging to see what's happening
  }
);

// Define Queue model
const Queue = sequelize.define('Queue', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  patientId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  doctorId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  queueNumber: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM('waiting', 'called', 'in-consultation', 'completed', 'cancelled'),
    defaultValue: 'waiting'
  },
  priority: {
    type: Sequelize.ENUM('normal', 'urgent', 'emergency'),
    defaultValue: 'normal'
  },
  estimatedWaitTime: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  notes: {
    type: Sequelize.TEXT,
    allowNull: true
  }
});

async function createQueueTable() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful');
    
    console.log('Creating Queue table...');
    await Queue.sync({ force: true });
    console.log('✅ Queue table created successfully!');
    
    // Test creating a sample queue entry
    const sampleQueue = await Queue.create({
      patientId: 1,
      queueNumber: 1,
      status: 'waiting',
      priority: 'normal',
      estimatedWaitTime: 15
    });
    
    console.log('✅ Sample queue entry created:', sampleQueue.id);
    
    // Verify the table exists
    const tables = await sequelize.showAllSchemas();
    console.log('Available tables:', tables);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

createQueueTable(); 