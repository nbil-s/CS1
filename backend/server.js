require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initModels } = require('./models');
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const receptionistRoutes = require('./routes/receptionistRoutes');
const patientRoutes = require('./routes/patientRoutes');
const queueRoutes = require('./routes/queueRoutes');

const app = express();

// Configure CORS to handle credentials
app.use(cors({
  origin: ['http://localhost:5173', 'https://localhost:5173'], // Allow both HTTP and HTTPS
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

app.use(express.json());

// Test route to verify server is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/receptionist', receptionistRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/queue', queueRoutes);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

initModels();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
