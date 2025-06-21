import mysql from 'mysql2';

// Directly insert your credentials (since you're not using dotenv here)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'queue_manager'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err.message);
    throw err;
  }
  console.log('Connected to MySQL database');
});

export default db;
