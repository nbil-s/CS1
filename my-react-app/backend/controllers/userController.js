import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import randomstring from 'randomstring';
import db from '../config/dbConnection.js';
import sendMail from '../helpers/sendMail.js';

const register = async (req, res) => {
  console.log('[REGISTER] Incoming signup request:', req.body);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.warn('[REGISTER] Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  console.log('[REGISTER] Checking if email exists...');
  db.query(
    'SELECT * FROM users WHERE LOWER(email) = LOWER(?)',
    [email],
    (err, result) => {
      if (err) {
        console.error('[REGISTER] Error during email check:', err.message);
        return res.status(500).send({ msg: 'Database error', error: err.message });
      }

      if (result.length > 0) {
        console.warn('[REGISTER] Email already exists:', email);
        return res.status(409).send({ msg: 'This email is already in use!' });
      }

      console.log('[REGISTER] Email is new. Hashing password...');
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error('[REGISTER] Password hashing failed:', err.message);
          return res.status(500).send({ msg: 'Error encrypting password' });
        }

        const token = randomstring.generate();
        console.log('[REGISTER] Inserting new user with verification token:', token);

        db.query(
          'INSERT INTO users (name, email, password, token, verified) VALUES (?, ?, ?, ?, ?)',
          [name, email, hash, token, 0],
          (err, result) => {
            if (err) {
              console.error('[REGISTER] Failed to insert user:', err.message);
              return res.status(500).send({ msg: 'Failed to save user', error: err.message });
            }

            const mailSubject = 'Verify Your Email';
            const content = `
              <p>Hi ${name},</p>
              <p>Click the link below to verify your email address:</p>
              <a href="http://localhost:5000/api/mail-verification?token=${token}">Verify Email</a>
            `;

            console.log('[REGISTER] Sending verification email to:', email);

            sendMail(email, mailSubject, content)
              .then(() => {
                console.log('[REGISTER] Verification email sent successfully to:', email);
              })
              .catch((err) => {
                console.error('[REGISTER] Failed to send verification email:', err.message);
              });

            return res.status(200).send({
              msg: 'User registered successfully. Please verify your email.'
            });
          }
        );
      });
    }
  );
};

// Email verification endpoint
const verifyEmail = (req, res) => {
  const token = req.query.token;
  console.log('[VERIFY EMAIL] Token received:', token);

  if (!token) {
    console.warn('[VERIFY EMAIL] Missing token');
    return res.status(400).send({ msg: 'Invalid or missing token' });
  }

  db.query(
    'SELECT * FROM users WHERE token = ?',
    [token],
    (err, result) => {
      if (err) {
        console.error('[VERIFY EMAIL] DB query error:', err.message);
        return res.status(500).send({ msg: 'Database error' });
      }

      if (result.length === 0) {
        console.warn('[VERIFY EMAIL] Token not found or already used:', token);
        return res.status(400).send({ msg: 'Invalid token or already verified' });
      }

      console.log('[VERIFY EMAIL] Verifying user ID:', result[0].id);

      db.query(
        'UPDATE users SET verified = ?, token = NULL WHERE id = ?',
        [1, result[0].id],
        (err) => {
          if (err) {
            console.error('[VERIFY EMAIL] Failed to update user verification:', err.message);
            return res.status(500).send({ msg: 'Failed to verify user' });
          }

          console.log('[VERIFY EMAIL] Email verification successful for user ID:', result[0].id);
          return res.status(200).send({
            success: true,
            token: null,
            msg: 'Email verified successfully. You can now log in.'
          });
        }
      );
    }
  );
};

const resendVerification = (req, res) => {
  const { email } = req.body;
  console.log('[RESEND VERIFICATION] Request to resend to:', email);

  if (!email) {
    console.warn('[RESEND VERIFICATION] No email provided');
    return res.status(400).send({ msg: 'Email is required' });
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) {
      console.error('[RESEND VERIFICATION] DB error:', err.message);
      return res.status(500).send({ msg: 'Database error' });
    }

    if (result.length === 0) {
      console.warn('[RESEND VERIFICATION] User not found:', email);
      return res.status(404).send({ msg: 'User not found' });
    }

    const user = result[0];

    if (user.verified) {
      console.log('[RESEND VERIFICATION] Email already verified for:', email);
      return res.status(400).send({ msg: 'Email already verified' });
    }

    const newToken = randomstring.generate();
    console.log('[RESEND VERIFICATION] Generating new token:', newToken);

    db.query(
      'UPDATE users SET token = ? WHERE email = ?',
      [newToken, email],
      (err) => {
        if (err) {
          console.error('[RESEND VERIFICATION] Token update failed:', err.message);
          return res.status(500).send({ msg: 'Failed to update token' });
        }

        const mailSubject = 'Resend: Verify Your Email';
        const content = `
          <p>Hi ${user.name},</p>
          <p>Click the link below to verify your email address:</p>
          <a href="http://localhost:5000/api/mail-verification?token=${newToken}">Verify Email</a>
        `;

        console.log('[RESEND VERIFICATION] Sending email to:', email);

        sendMail(email, mailSubject, content)
          .then(() => {
            console.log('[RESEND VERIFICATION] Email resent to:', email);
          })
          .catch((err) => {
            console.error('[RESEND VERIFICATION] Failed to send email:', err.message);
          });

        return res.status(200).send({ msg: 'Verification email resent' });
      }
    );
  });
};

export { register, verifyEmail, resendVerification };
