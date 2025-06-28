require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initModels } = require('./models');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Configure CORS to handle credentials
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

initModels();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
