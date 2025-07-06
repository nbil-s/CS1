import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { sendVerificationEmail } from './emailService.js';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET);
const app = express();
const PORT = 5000;
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('❌ JWT_SECRET not set in .env!');
  process.exit(1); // Optional: stop the server if critical env is missing
}



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

// JWT Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("📥 Received Authorization Header:", authHeader);
  const token = authHeader && authHeader.split(' ')[1];
  console.log("🔑 Extracted Token:", token);
  if (!token) {
    console.warn('🚫 Token missing');
    return res.status(401).json({ success: false, message: 'Token missing' });
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.warn('❌ Token invalid:', err.message);
      return res.status(403).json({ success: false, message: 'Invalid token' });
    }  
    req.user = user;
    next();
  });
}

app.get('/test', (req, res) => {
  res.send('Server is working!');
});

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields required' });
  }

  const checkSql = 'SELECT * FROM users WHERE email = ?';
  db.query(checkSql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });

    if (results.length > 0) return res.status(409).json({ success: false, message: 'Email already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUser = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

    db.query(insertUser, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ success: false, message: 'Registration failed' });

      const userId = result.insertId;
      // DELETE expired codes (in signup route)
      db.query(`DELETE FROM verification_codes WHERE TIMESTAMPDIFF(MINUTE, created_at, NOW()) > 10`, (err) => {
      if (err) {
        console.error("Cleanup error before signup code:", err);
       // Optional: don't block signup even if this fails
      }
      });
      const insertCode = 'INSERT INTO verification_codes (user_id, code) VALUES (?, ?)';

      db.query(insertCode, [userId, verificationCode], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Code creation failed' });

        sendVerificationEmail({ name, email, code: verificationCode });
        res.json({ success: true, message: 'Verification email sent' });
      });
    });
  });
});

app.post('/api/resend-code', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });

  db.query('SELECT user_id, name FROM users WHERE email = ?', [email], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = results[0];
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    db.query('DELETE FROM verification_codes WHERE user_id = ?', [user.user_id], () => {
      db.query('INSERT INTO verification_codes (user_id, code) VALUES (?, ?)', [user.user_id, newCode], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Failed to generate code' });

        sendVerificationEmail({ name: user.name, email, code: newCode });
        res.json({ success: true, message: 'Verification code resent' });
      });
    });
  });
});


app.post('/api/verify-code', (req, res) => {
  const { code } = req.body;

  const sql = `
    SELECT vc.user_id, u.email, u.name, u.role
    FROM verification_codes vc
    JOIN users u ON u.user_id = vc.user_id
    WHERE vc.code = ? AND TIMESTAMPDIFF(MINUTE, vc.created_at, NOW()) < 10
  `;

  db.query(sql, [code], (err, results) => {
    if (err || results.length === 0) {
      return res.status(403).json({ success: false, message: 'Invalid or expired code' });
    }

    const user = results[0];

    // Mark user as verified
    db.query('UPDATE users SET is_verified = TRUE WHERE user_id = ?', [user.user_id], (err) => {
      if (err) return res.status(500).json({ success: false, message: 'Verification update failed' });

      const token = jwt.sign(
        { id: user.user_id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      db.query('DELETE FROM verification_codes WHERE user_id = ?', [user.user_id]);

      res.json({
        success: true,
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
});


app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Database error' });
    if (results.length === 0) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const user = results[0];

    if (!user.is_verified) {
      return res.status(403).json({ success: false, message: 'Account not verified' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.user_id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    if (user.role === 'staff') {
      const staffSql = 'SELECT staff_type FROM staff_roles WHERE user_id = ?';
      db.query(staffSql, [user.user_id], (err, staffResults) => {
        const staffType = (staffResults && staffResults[0]) ? staffResults[0].staff_type : null;
    
        res.json({
          success: true,
          message: 'Login successful',
          token,
          user: {
            id: user.user_id,
            name: user.name,
            email: user.email,
            role: user.role,
            staffType: staffType // ➕ Include staff type
          }
        });
      });
    } else {
      res.json({
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
    };
  });
});


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

app.post('/api/remote-queue', authenticateToken, (req, res) => {
  const { name, phone, service, reason } = req.body;
  const staffRole = req.user.role;

  if (staffRole !== 'staff') {
    return res.status(403).json({ success: false, message: 'Only staff can add patients remotely' });
  }

  if (!name || !phone || !service)
    return res.status(400).json({ success: false, message: 'Name, phone, and service are required' });

  const ticketNumber = `${service.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-5)}`;

  const sql = `INSERT INTO queue (user_id, name, phone, service, reason, joined_at, Ticket_num)
               VALUES (NULL, ?, ?, ?, ?, NOW(), ?)`;

  db.query(sql, [name, phone, service, reason, ticketNumber], (err) => {
    if (err) {
      console.error('Remote Queue Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to add patient to queue' });
    }
    res.json({ success: true, message: 'Patient added to queue', ticket: ticketNumber });
  });
});



app.get('/api/view-queue', (req, res) => {
  const sql = `SELECT queue_id, name, phone, service, Ticket_num, joined_at
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
  const userId = req.user.id;

  const checkVerifiedSql = 'SELECT is_verified FROM users WHERE user_id = ?';
  db.query(checkVerifiedSql, [userId], (err, results) => {
    if (err || results.length === 0 || !results[0].is_verified) {
      return res.status(403).json({ success: false, message: 'User not verified' });
    }

    const sql = `SELECT * FROM appointments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1`;
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ success: false });
      if (results.length === 0) return res.json({ success: true, appointment: null });
      res.json({ success: true, appointment: results[0] });
    });
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
  if (role === 'admin' && !email.endsWith('@clinicqueue.com')) {
    return res.status(400).json({ success: false, message: 'Admin email must end with @clinicqueue.com' });
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

    const insertSql = `
  INSERT INTO users (name, email, phone, role, password, is_verified)
  VALUES (?, ?, ?, ?, ?, ?)
`;

db.query(insertSql, [name, email, phone, role, hashedPassword, true], (err, result) => {
  if (err) {
    console.error('Insert Error:', err);
    return res.status(500).json({ success: false, message: 'User creation failed' });
  }

  const userId = result.insertId;

  // Insert into staff_roles if staff
  if (role === 'staff') {
    const staffType = req.body.staffType;
    const insertStaffSql = 'INSERT INTO staff_roles (user_id, staff_type) VALUES (?, ?)';
    db.query(insertStaffSql, [userId, staffType], (staffErr) => {
      if (staffErr) {
        console.error('Staff role insert error:', staffErr);
        return res.status(500).json({ success: false, message: 'Failed to assign staff role' });
      }

      // Success
      console.log(`📧 Email sent to ${email} with temp password: ${randomPassword}`);
      return res.status(201).json({
        success: true,
        message: 'Staff added successfully',
        password: randomPassword
      });
    });
  } else {
    // Admin success response
    console.log(`📧 Email sent to ${email} with temp password: ${randomPassword}`);
    res.status(201).json({
      success: true,
      message: 'Admin added successfully',
      password: randomPassword
    });
  }
  })
})
})

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

  if (!password) return res.status(400).json({ success: false, message: 'Password is required' });
  if (!['staff', 'admin'].includes(role)) return res.status(403).json({ success: false, message: 'Access denied' });

  db.query('SELECT * FROM users WHERE user_id = ?', [userId], async (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ success: false, message: 'User not found' });

    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(403).json({ success: false, message: 'Incorrect password' });

    const checkSql = 'SELECT * FROM attendance WHERE user_id = ? AND date = CURDATE()';
    db.query(checkSql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });

      if (rows.length > 0) return res.status(409).json({ success: false, message: 'Already clocked in today' });

      const insertSql = 'INSERT INTO attendance (user_id, clockin_time, remarks) VALUES (?, NOW(), ?)';
      db.query(insertSql, [userId, remarks || null], (err, result) => {
        if (err) return res.status(500).json({ success: false, message: 'Clock-in failed' });
        res.status(201).json({ success: true, message: 'Clock-in successful' });
      });
    });
  });
});

app.post('/api/clock-out', authenticateToken, async (req, res) => {
  const { remarks, password } = req.body;
  const userId = req.user.id;
  const role = req.user.role;

  if (!password) return res.status(400).json({ success: false, message: 'Password is required' });
  if (!['staff', 'admin'].includes(role)) return res.status(403).json({ success: false, message: 'Access denied' });

  db.query('SELECT * FROM users WHERE user_id = ?', [userId], async (err, results) => {
    if (err || results.length === 0) return res.status(500).json({ success: false, message: 'User not found' });

    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(403).json({ success: false, message: 'Incorrect password' });

    const checkSql = 'SELECT * FROM attendance WHERE user_id = ? AND date = CURDATE()';
    db.query(checkSql, [userId], (err, rows) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });

      if (rows.length === 0) return res.status(400).json({ success: false, message: 'Clock-in required before clocking out' });

      const record = rows[0];
      if (record.clockout_time) return res.status(409).json({ success: false, message: 'Already clocked out today' });

      const updateSql = 'UPDATE attendance SET clockout_time = NOW(), remarks = ? WHERE attendance_id = ?';
      db.query(updateSql, [remarks || record.remarks, record.attendance_id], (err) => {
        if (err) return res.status(500).json({ success: false, message: 'Clock-out failed' });
        res.json({ success: true, message: 'Clock-out successful' });
      });
    });
  });
});


app.delete('/api/admin/delete-user/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;
  const requestingAdminId = req.user.id;

  // Step 1: Check if target user exists and get their role
  const checkUserSql = 'SELECT user_id, role FROM users WHERE user_id = ?';
  db.query(checkUserSql, [userId], (err, results) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const targetUser = results[0];

    // Step 2: Prevent deleting other admins (or allow only superadmin if you implement that)
    if (targetUser.role === 'admin') {
      return res.status(403).json({ success: false, message: 'You are not allowed to delete other admins' });
    }
    if (parseInt(userId) === requestingAdminId) {
      return res.status(403).json({ success: false, message: 'You cannot delete yourself' });
    }
    

    // Step 3: Proceed with deletion for staff
    const deleteSql = 'DELETE FROM users WHERE user_id = ?';
    db.query(deleteSql, [userId], (err, result) => {
      if (err) {
        console.error('Delete Error:', err);
        return res.status(500).json({ success: false, message: 'Deletion failed' });
      }

      res.json({ success: true, message: `${targetUser.role} deleted successfully` });
    });
  });
});

app.get('/api/admin/user/:id', authenticateToken, (req, res) => {
  const userId = req.params.id;

  const sql = 'SELECT user_id, name, email, phone, role FROM users WHERE user_id = ? AND role IN ("staff", "admin")';
  db.query(sql, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: results[0] });
  });
});

app.put('/api/admin/update-user/:id', authenticateToken, async (req, res) => {
  const userId = req.params.id;
  const { name, email, phone, role, password } = req.body;

  if (!password) return res.status(400).json({ success: false, message: 'Password is required to update' });

  // Verify password of the requesting admin
  db.query('SELECT * FROM users WHERE user_id = ?', [req.user.id], async (err, results) => {
    if (err || results.length === 0) return res.status(403).json({ success: false });

    const match = await bcrypt.compare(password, results[0].password);
    if (!match) return res.status(403).json({ success: false, message: 'Incorrect password' });

    const sql = 'UPDATE users SET name = ?, email = ?, phone = ?, role = ? WHERE user_id = ?';
    db.query(sql, [name, email, phone, role, userId], (err) => {
      if (err) {
        console.error('Update error:', err);
        return res.status(500).json({ success: false, message: 'Update failed' });
      }
      res.json({ success: true, message: 'User updated successfully' });
    });
  });
});

// Get appointments assigned to a specific doctor
app.get('/api/doctor/appointments', authenticateToken, (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  const checkStaffSql = 'SELECT staff_type FROM staff_roles WHERE user_id = ?';
 db.query(checkStaffSql, [userId], (err, results) => {
  if (err || results.length === 0 || results[0].staff_type !== 'doctor') {
    return res.status(403).json({ success: false, message: 'Access denied: Not a doctor' });
  }

  const sql = `
    SELECT * FROM appointments
    WHERE clinician = (
      SELECT name FROM users WHERE user_id = ?
    )
    ORDER BY date ASC, time ASC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching doctor appointments:', err);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }

    res.json({
      success: true,
      total: results.length,
      appointments: results
    });
  })
  });
});


app.get('/api/staff-type', authenticateToken, async (req, res) => {
  try {
    const [result] = await db.promise().query(
      'SELECT staff_type FROM staff_roles WHERE user_id = ?',
      [req.user.id] // ✅ FIXED
    );

    if (result.length > 0) {
      res.json({ success: true, staffType: result[0].staff_type });
    } else {
      res.json({ success: false, message: 'Staff role not found' });
    }
  } catch (err) {
    console.error("❌ Staff type fetch error:", err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// Get the next patient in the queue (oldest joined_at)
app.get('/api/next-patient', authenticateToken, (req, res) => {
  const role = req.user.role;

  if (role !== 'staff') {
    return res.status(403).json({ success: false, message: 'Only staff can view queue' });
  }

  const sql = `SELECT * FROM queue ORDER BY joined_at ASC LIMIT 1`;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Failed to fetch next patient' });
    if (results.length === 0) return res.json({ success: true, patient: null });
    res.json({ success: true, patient: results[0] });
  });
});

// Confirm/call patient and remove from queue
app.delete('/api/confirm-patient/:queueId', authenticateToken, (req, res) => {
  const role = req.user.role;

  if (role !== 'staff') {
    return res.status(403).json({ success: false, message: 'Only staff can remove from queue' });
  }

  const queueId = req.params.queueId;

  const sql = 'DELETE FROM queue WHERE queue_id = ?';
  db.query(sql, [queueId], (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Failed to confirm patient' });
    res.json({ success: true, message: 'Patient confirmed and removed from queue' });
  });
});

// DELETE: Remove patient from queue by ticket number or name
app.delete('/api/remove-from-queue', authenticateToken, (req, res) => {
  const { ticket, name } = req.body;
  const role = req.user.role;

  if (role !== 'staff') {
    return res.status(403).json({ success: false, message: 'Only staff can remove from queue' });
  }

  let sql, param;
  if (ticket) {
    sql = 'DELETE FROM queue WHERE Ticket_num = ?';
    param = ticket;
  } else if (name) {
    sql = 'DELETE FROM queue WHERE name = ?';
    param = name;
  } else {
    return res.status(400).json({ success: false, message: 'Provide ticket number or name' });
  }

  db.query(sql, [param], (err, result) => {
    if (err) {
      console.error('❌ Remove Error:', err);
      return res.status(500).json({ success: false, message: 'Failed to remove from queue' });
    }

    if (result.affectedRows === 0) {
      return res.json({ success: false, message: 'No matching patient found' });
    }

    res.json({ success: true, message: 'Patient removed from queue' });
  });
});

app.patch('/api/increase-priority/:ticket', authenticateToken, (req, res) => {
  const { ticket } = req.params;
  const userRole = req.user.role;

  if (userRole !== 'staff') {
    return res.status(403).json({ success: false, message: 'Only staff can update priority.' });
  }

  const checkSql = 'SELECT * FROM queue WHERE Ticket_num = ?';
  db.query(checkSql, [ticket], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }

    const queueId = results[0].queue_id;
    const prioritySql = 'UPDATE queue SET joined_at = NOW() - INTERVAL 1 HOUR WHERE queue_id = ?';
    db.query(prioritySql, [queueId], (err2) => {
      if (err2) {
        console.error('Priority update error:', err2);
        return res.status(500).json({ success: false, message: 'Failed to increase priority.' });
      }

      res.json({ success: true, message: 'Priority increased.' });
    });
  });
});


app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});