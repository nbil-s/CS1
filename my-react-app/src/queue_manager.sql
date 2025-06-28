drop database queue_manager;

CREATE DATABASE queue_manager;
USE queue_manager;

CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  phone VARCHAR(20) NULL,
  password VARCHAR(255),
  role ENUM('patient', 'staff', 'admin') DEFAULT 'patient',
  token VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE queue (
  queue_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  service VARCHAR(50) NOT NULL,
  Ticket_num VARCHAR(30) NOT NULL,
  reason TEXT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
-- STEP 1: Create the appointments table in `queue_manager`
USE queue_manager;
CREATE TABLE appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  department VARCHAR(100) NOT NULL,
  clinician VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Create default admin
INSERT INTO users (name, email, password, role)
VALUES (
  'Default Admin',
  'admin@clinicqueue.com',
  -- password: Admin@123
  '$2b$10$LAnqSiPL4J9H/2hzG6yx0eaTSh7NywcnGP8J7wvgQdcCanAJMOiJu',
  'admin'
);

-- Create random staff
INSERT INTO users (name, email, password, role)
VALUES (
  'John Doe',
  'jdoe@clinicqueue.com',
  -- password: Staff@123
  '$2b$10$mmhvpqQ6vrlPo3EYyLA/gutxYhN8dXBi./NHofSRIfngecvYCdaiK',
  'staff'
);

USE queue_manager;
CREATE TABLE attendance (
  attendance_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  clockin_time DATETIME DEFAULT NULL,
  clockout_time DATETIME DEFAULT NULL,
  remarks TEXT,
  date DATE GENERATED ALWAYS AS (DATE(clockin_time)) STORED,
  UNIQUE KEY unique_attendance (user_id, date),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);





