import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Admin123@Matt',
  database: 'queue_manager',
  port: 3306
});


db.connect(err => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL');
});


const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).json({ message: 'Invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields are required' });

  const domain = email.split('@')[1];
  const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  if (!allowedDomains.includes(domain.toLowerCase()))
    return res.status(400).json({ success: false, message: 'Email domain not allowed' });
  const disallowedDomains = ['clinicqueue.com'];
  if (disallowedDomains.includes(domain.toLowerCase())) {
    return res.status(403).json({ success: false, message: 'Registration with this domain is restricted' });
  }


  const checkSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length > 0)
      return res.status(409).json({ success: false, message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertSql, [name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Registration failed' });

      res.status(200).json({ success: true, message: 'User registered successfully' });
    });
  });
});

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const user = results[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.user_id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// JWT Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token missing' });

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, user) => {
    if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Join Queue Route
app.post('/api/queue', authenticateToken, (req, res) => {
  const { name, phone, service, reason } = req.body;
  const userId = req.user.id;

  if (!name || !phone || !service)
    return res.status(400).json({ success: false, message: 'Name, phone, and service are required' });

  // Generate ticket number
  const ticketNumber = `${service.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;

  const sql = `INSERT INTO queue (user_id, name, phone, service, reason, joined_at, Ticket_num)
               VALUES (?, ?, ?, ?, ?, NOW(), ?)`;

  db.query(sql, [userId, name, phone, service, reason, ticketNumber], (err) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to join queue' });
    }
    res.json({ success: true, message: 'Successfully joined the queue', ticket: ticketNumber });
  });
});


app.get('/api/view-queue', (req, res) => {
  const sql = `SELECT service, Ticket_num, joined_at
               FROM queue
               ORDER BY joined_at ASC`;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('DB Fetch Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to retrieve queue' });
    }

    res.json({ success: true, queue: results });
  });
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  const { name, phone, department, clinician, date, time, reason } = req.body;
  const userId = req.user.id;

  const sql = `
    INSERT INTO appointments (user_id, name, phone, department, clinician, date, time, reason)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [userId, name, phone, department, clinician, date, time, reason], (err) => {
    if (err) {
      console.error("DB Insert Error:", err);
      return res.status(500).json({ success: false, message: "Failed to book appointment." });
    }
    res.json({ success: true, message: "Appointment booked successfully." });
  });
});

// Get appointment for logged-in user
app.get('/api/my-appointment', authenticateToken, (req, res) => {
  const sql = `SELECT * FROM appointments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (results.length === 0) return res.json({ success: true, appointment: null });
    res.json({ success: true, appointment: results[0] });
  });
});

// Cancel appointment
app.delete('/api/my-appointment', authenticateToken, (req, res) => {
  const sql = `DELETE FROM appointments WHERE user_id = ?`;
  db.query(sql, [req.user.id], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true });
  });
});

// Add Staff/Admin User with random password & email trigger
app.post('/api/admin/add-user', authenticateToken, async (req, res) => {
  const { name, email, role, phone } = req.body;

  if (!['staff', 'admin'].includes(role)) {
    return res.status(400).json({ success: false, message: 'Invalid role specified' });
  }

  if (role === 'staff' && !email.endsWith('@clinicqueue.com')) {
    return res.status(400).json({ success: false, message: 'Staff email must end with @clinicqueue.com' });
  }

  if (role === 'admin' && !email.toLowerCase().includes('admin')) {
    return res.status(400).json({ success: false, message: 'Admin email must include "admin"' });
  }

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  const checkSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Generate random default password
    const randomPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const insertSql = `INSERT INTO users (name, email, phone, role, password) VALUES (?, ?, ?, ?, ?)`;
    db.query(insertSql, [name, email, phone, role, hashedPassword], (err) => {
      if (err) {
        console.error('Insert Error:', err);
        return res.status(500).json({ success: false, message: 'User creation failed' });
      }

      // Optionally send email notification (simulate for now)
      console.log(`📧 Email sent to ${email} with temp password: ${randomPassword}`);

      res.status(201).json({ success: true, message: 'User added successfully', password: randomPassword });
    });
  });
});

// Admin: Get all staff/admin users
app.get('/api/admin/users', authenticateToken, (req, res) => {
  const sql = 'SELECT user_id, name, email, phone, role FROM users WHERE role IN ("staff", "admin")';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Failed to retrieve users' });
    res.json({ success: true, users: results });
  });
});

app.post('/api/clock-in', authenticateToken, async (req, res) => {
  const { remarks, password } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  if (!password)
    return res.status(400).json({ success: false, message: 'Password is required' });

  if (role !== 'staff' && role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only staff/admin can clock in' });
  }

  const getUserSql = 'SELECT * FROM users WHERE user_id = ?';
  db.query(getUserSql, [userId], async (err, results) => {
    if (err || results.length === 0) {
      console.error('User lookup error:', err);
      return res.status(500).json({ success: false, message: 'User lookup failed' });
    }

    const user = results[0];
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(403).json({ success: false, message: 'Incorrect password' });
    }

    // Check for existing clock-in today
    const checkSql = `
      SELECT * FROM clockin
      WHERE user_id = ? AND DATE(timestamp) = CURDATE()
    `;

    db.query(checkSql, [userId], (err, results) => {
      if (err) {
        console.error('Clock-in check error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'Already clocked in today' });
      }

      // Insert new clock-in record
      const insertSql = `INSERT INTO clockin (user_id, remarks) VALUES (?, ?)`;
      db.query(insertSql, [userId, remarks || null], (err, result) => {
        if (err) {
          console.error('Insert error:', err);
          return res.status(500).json({ success: false, message: 'Clock-in failed' });
        }

        res.status(201).json({
          success: true,
          message: 'Clock-in successful',
          record: {
            id: result.insertId,
            user_id: userId,
            timestamp: new Date().toISOString(),
            remarks: remarks || null
          }
        });
      });
    });
  });
});

app.post('/api/clock-out', authenticateToken, async (req, res) => {
  const { remarks, password } = req.body;
  const userId = req.user.id;

});

app.delete('/api/admin/delete-user/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM users WHERE user_id = ?';

  db.query(sql, [userId], (err, result) => {
    if (err) {
      console.error('Delete Error:', err);
      return res.status(500).json({ success: false, message: 'Deletion failed' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, message: 'User deleted successfully' });
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});