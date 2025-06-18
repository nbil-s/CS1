const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for development
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.use(express.json());

// Secret key for JWT
const JWT_SECRET = 'your-secret-key';

// Mock user database with simple password for testing
const users = [
  {
    username: 'patient1',
    password: 'password123', // Simple password for testing
    role: 'patient'
  },
  {
    username: 'doctor1',
    password: 'password123',
    role: 'doctor'
  },
  {
    username: 'receptionist1',
    password: 'password123',
    role: 'receptionist'
  },
  {
    username: 'admin1',
    password: 'password123',
    role: 'admin'
  }
];

// Mock appointments data
const appointments = [
  {
    id: 1,
    patientName: 'John Doe',
    date: '2024-01-15',
    time: '10:00 AM',
    datetime: '2024-01-15T10:00:00',
    status: 'pending',
    doctorId: 'doctor1'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    date: '2024-01-15',
    time: '11:30 AM',
    datetime: '2024-01-15T11:30:00',
    status: 'completed',
    doctorId: 'doctor1'
  },
  {
    id: 3,
    patientName: 'Mike Johnson',
    date: '2024-01-16',
    time: '09:00 AM',
    datetime: '2024-01-16T09:00:00',
    status: 'accepted',
    doctorId: 'doctor1'
  }
];

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    console.log('Login attempt:', { username, role }); // Debug log

    // Find user
    const user = users.find(u => u.username === username && u.role === role);
    
    console.log('Found user:', user); // Debug log

    if (!user) {
      console.log('User not found or role mismatch'); // Debug log
      return res.status(401).json({ message: 'Invalid credentials or role' });
    }

    // Simple password check
    if (password !== user.password) {
      console.log('Password mismatch'); // Debug log
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Login successful, sending response'); // Debug log

    // Send response
    res.json({
      token,
      userRole: user.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Doctor appointments endpoint
app.get('/api/doctor/appointments', (req, res) => {
  try {
    // In a real app, you would verify the JWT token and get the doctor ID
    // For now, we'll return all appointments for doctor1
    const doctorAppointments = appointments.filter(apt => apt.doctorId === 'doctor1');
    
    res.json({
      appointments: doctorAppointments,
      total: doctorAppointments.length
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Patient appointments endpoint
app.post('/api/patient/appointments', (req, res) => {
  try {
    const { datetime } = req.body;
    
    // Create a new appointment
    const newAppointment = {
      id: appointments.length + 1,
      patientName: 'New Patient', // In real app, get from JWT token
      date: datetime.split('T')[0],
      time: datetime.split('T')[1],
      datetime: datetime,
      status: 'pending',
      doctorId: 'doctor1' // In real app, assign based on availability
    };
    
    appointments.push(newAppointment);
    
    res.json({
      message: 'Appointment booked successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error('Error booking appointment:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update appointment status endpoint
app.put('/api/doctor/appointments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointmentIndex = appointments.findIndex(apt => apt.id === parseInt(id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    appointments[appointmentIndex].status = status;
    
    res.json({
      message: 'Appointment status updated successfully',
      appointment: appointments[appointmentIndex]
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Protected route example
app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ message: 'Protected data', user: decoded });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle server errors
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port.`);
    process.exit(1);
  } else {
    console.error('Server error:', error);
  }
}); 