const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

exports.register = async (req, res) => {
  try {
    console.log('=== REGISTRATION REQUEST ===');
    console.log('Full request body:', req.body);
    console.log('Registration request received:', { 
      name: req.body.name, 
      email: req.body.email, 
      hasPassword: !!req.body.password 
    });
    
    // Test database connection
    try {
      await User.findOne({ where: { id: 1 } });
      console.log('Database connection test: SUCCESS');
    } catch (dbError) {
      console.error('Database connection test: FAILED', dbError);
      return res.status(500).json({ message: 'Database connection failed' });
    }
    
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    console.log('Creating new user...');
    const passwordHash = bcrypt.hashSync(password, 10);
    console.log('Password hashed successfully');

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'patient' // default
    });

    console.log('User created successfully:', { id: user.id, email: user.email, role: user.role });
    console.log('=== REGISTRATION SUCCESS ===');
    res.json({ 
      message: 'User created successfully', 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('=== REGISTRATION ERROR ===');
    console.error('Registration error details:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST ===');
    const { email, username, password } = req.body;
    
    // Handle both email and username fields
    const identifier = email || username;
    
    console.log('Login attempt:', { 
      identifier, 
      password: password ? '***' : 'missing', 
      role: req.body.role,
      fullBody: req.body 
    });
    
    if (!identifier || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    console.log('Looking for user with email or username:', identifier);
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { email: identifier },
          { name: identifier }
        ]
      }
    });
    console.log('User found:', user ? { id: user.id, email: user.email, role: user.role } : 'No user found');

    if (!user) {
      console.log('User not found with email:', identifier);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.passwordHash);
    console.log('Password match:', passwordMatch);

    if (!passwordMatch) {
      console.log('Password mismatch for user:', user.email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    console.log('Login successful for user:', user.email);
    console.log('Generated token:', token.substring(0, 20) + '...');
    console.log('=== LOGIN SUCCESS ===');
    
    res.json({ 
      token, 
      user: { id: user.id, name: user.name, email: user.email, role: user.role } 
    });
  } catch (error) {
    console.error('=== LOGIN ERROR ===');
    console.error('Login error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: 'Failed to get user info', error: error.message });
  }
}; 