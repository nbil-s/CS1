const bcrypt = require('bcryptjs');
const { User, Queue, Appointment, Notification } = require('./models');

async function seedUsers() {
  try {
    // Create test users for each role
    const testUsers = [
      {
        name: 'Test Patient',
        email: 'patient1@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'patient'
      },
      {
        name: 'Test Doctor',
        email: 'doctor1@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'doctor'
      },
      {
        name: 'Test Receptionist',
        email: 'receptionist1@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'receptionist'
      },
      {
        name: 'admin',
        email: 'admin@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'admin'
      }
    ];

    // Clear dependent tables first to avoid foreign key constraint errors
    await Queue.destroy({ where: {} });
    await Appointment.destroy({ where: {} });
    await Notification.destroy({ where: {} });

    // Clear existing users (optional - remove this if you want to keep existing data)
    await User.destroy({ where: {} });

    // Create the test users
    for (const userData of testUsers) {
      await User.create(userData);
      console.log(`Created user: ${userData.name} (${userData.email})`);
    }

    console.log('✅ Test users created successfully!');
    console.log('\nYou can now log in with:');
    console.log('- Username: patient1, Email: patient1@example.com, Password: password123, Role: patient');
    console.log('- Username: doctor1, Email: doctor1@example.com, Password: password123, Role: doctor');
    console.log('- Username: receptionist1, Email: receptionist1@example.com, Password: password123, Role: receptionist');
    console.log('- Username: admin, Email: admin@example.com, Password: password123, Role: admin');

  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    process.exit(0);
  }
}

seedUsers(); 