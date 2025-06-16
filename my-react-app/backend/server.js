import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';


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

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString(); // ensures 6-digit
}


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

    const allowedDomains = [
        'gmail.com',
        'yahoo.com',
        'outlook.com',
        'hotmail.com'
    ]
    const emailDomain = email.toLowerCase().split('@')[1];
    if(!allowedDomains.includes(emailDomain)){
        return res.status(400).json({
            success: false,
            message: 'Please use a valid email from a known domain like Gmail or Outlook.'
        })
    }
  
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

  app.post('api/send-otp', async(req, res) => {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({success: false, message: 'Email is required'});
    }

    const otp = generateOTP();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'clinic.queue.management@gmail.com',
        pass: 'ClinicManager@2025'
      }
    })

    const mailOptions = {
      from: 'clinic.queue.management@gmail.com',
      to: email,
      subject: 'ClinicQueue OTP Verfication Code',
      text: 'Your OTP code is: ${otp}'
    }

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending OTP: ', err);
        return res.status(500).json({success: false, message: 'Failed to send OTP'});
      } else {
        console.log('OTP sent:', info.response);
        return res.status(200).json({success: true, message: 'OTP sent successfully'})
      }
    })
  })
  

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})