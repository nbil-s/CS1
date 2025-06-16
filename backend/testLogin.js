const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('./models');

// Test environment variables
console.log('=== ENVIRONMENT CHECK ===');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('DB_NAME:', process.env.DB_NAME || 'clinic_queue_db');
console.log('DB_USER:', process.env.DB_USER || 'root');

// Test database connection
async function testDatabase() {
  try {
    console.log('\n=== DATABASE CONNECTION TEST ===');
    await User.findOne({ where: { id: 1 } });
    console.log('✅ Database connection successful');
    
    // Count users
    const userCount = await User.count();
    console.log(`📊 Total users in database: ${userCount}`);
    
    if (userCount === 0) {
      console.log('⚠️  No users found. Creating a test user...');
      
      const testUser = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        passwordHash: bcrypt.hashSync('password123', 10),
        role: 'patient'
      });
      
      console.log('✅ Test user created:', {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
        role: testUser.role
      });
    }
    
    // List all users
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'role']
    });
    
    console.log('\n📋 Current users:');
    users.forEach(user => {
      console.log(`  - ${user.name} (${user.email}) - ${user.role}`);
    });
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
}

// Test JWT functionality
function testJWT() {
  console.log('\n=== JWT TEST ===');
  
  if (!process.env.JWT_SECRET) {
    console.log('❌ JWT_SECRET not set. Please create a .env file with JWT_SECRET=your_secret_key');
    return;
  }
  
  try {
    const testPayload = { id: 1, role: 'patient' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '1d' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    console.log('✅ JWT creation and verification successful');
    console.log('  Token:', token.substring(0, 20) + '...');
    console.log('  Decoded:', decoded);
  } catch (error) {
    console.error('❌ JWT test failed:', error.message);
  }
}

// Test login simulation
async function testLogin() {
  console.log('\n=== LOGIN SIMULATION ===');
  
  try {
    const testEmail = 'test@example.com';
    const testPassword = 'password123';
    
    const user = await User.findOne({ where: { email: testEmail } });
    
    if (!user) {
      console.log('❌ Test user not found');
      return;
    }
    
    const passwordMatch = bcrypt.compareSync(testPassword, user.passwordHash);
    
    if (passwordMatch) {
      console.log('✅ Login simulation successful');
      console.log('  User:', user.name);
      console.log('  Role:', user.role);
      
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1d' }
      );
      
      console.log('  Token generated:', token.substring(0, 20) + '...');
    } else {
      console.log('❌ Password mismatch');
    }
    
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting login system tests...\n');
  
  await testDatabase();
  testJWT();
  await testLogin();
  
  console.log('\n=== TEST COMPLETE ===');
  console.log('\nTo create a .env file, add the following to backend/.env:');
  console.log('JWT_SECRET=your_super_secret_jwt_key_here');
  console.log('DB_HOST=localhost');
  console.log('DB_PORT=3306');
  console.log('DB_NAME=clinic_queue_db');
  console.log('DB_USER=root');
  console.log('DB_PASS=your_password');
  console.log('PORT=5000');
}

runTests().catch(console.error); 