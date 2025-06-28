const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

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
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: 'patient' // default
    });

    res.json({ message: 'User created', user });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    // Handle both email and username fields
    const identifier = email || username;
    
    console.log('Login attempt:', { identifier, password: password ? '***' : 'missing', role: req.body.role });
    
    if (!identifier || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET environment variable is not set');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const user = await User.findOne({ where: { email: identifier } });
    console.log('User found:', user ? { id: user.id, email: user.email, role: user.role } : 'No user found');

    if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
      console.log('Invalid credentials - user not found or password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    console.log('Login successful for user:', user.email);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    // Use the verifyToken middleware
    verifyToken(req, res, async () => {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['passwordHash'] }
      });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(user);
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Failed to get user info', error: error.message });
  }
}; 