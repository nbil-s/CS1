import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';



const app = express()
const PORT = 5000

app.use(cors())
app.use(express.json())

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'queue_manager'
})

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySql database')
})

app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
  
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const checkEmailSql = 'SELECT * FROM users WHERE email = ?';
    db.query(checkEmailSql, [email], (err, results) => {
      if (err) {
        console.error('Error checking email:', err);
        return res.status(500).json({ success: false, message: 'Database Error' });
      }
  
      if (results.length > 0) {
        return res.status(409).json({ success: false, message: 'Email already in use' });
      }
  
      const insertSql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
      db.query(insertSql, [name, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ success: false, message: 'Error saving User' });
        }
  
        res.status(200).json({ success: true, message: 'User registered' });
      });
    });
  });
  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})