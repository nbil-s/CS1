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
  password: '',
  database: 'queue_manager'
});

db.connect(err => {
  if (err) throw err;
  console.log('Connected to MySQL');
});


app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields are required' });

  const domain = email.split('@')[1];
  const allowed = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com'];
  if (!allowed.includes(domain.toLowerCase()))
    return res.status(400).json({ success: false, message: 'Email domain not allowed' });

  const checkUserSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkUserSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length > 0)
      return res.status(409).json({ success: false, message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertUserSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertUserSql, [name, email, hashedPassword], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Failed to register user' });

      res.status(200).json({
        success: true,
        message: 'User registered successfully'
      });
    });
  });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required' });

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: { id: user.id, name: user.name, email: user.email }
    });
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
