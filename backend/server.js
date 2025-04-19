const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..')));

// Create and initialize database
const db = new sqlite3.Database(path.join(__dirname, 'phishing_responses.db'));

// Create tables if they don't exist
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);

  // Responses table
  db.run(`CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    email_id INTEGER NOT NULL,
    email_type TEXT NOT NULL,
    user_response TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL,
    response_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

// Routes

// Register a new user
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  const query = 'INSERT INTO users (name) VALUES (?)';
  
  db.run(query, [name], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to create user' });
    }
    
    res.status(201).json({ id: this.lastID, name });
  });
});

// Record a user's response to an email
app.post('/api/responses', (req, res) => {
  const { userId, emailId, emailType, userResponse, isCorrect } = req.body;
  
  if (!emailId || !emailType || !userResponse) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const query = 'INSERT INTO responses (user_id, email_id, email_type, user_response, is_correct) VALUES (?, ?, ?, ?, ?)';
  
  db.run(query, [userId || null, emailId, emailType, userResponse, isCorrect], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to record response' });
    }
    
    res.status(201).json({ id: this.lastID, success: true });
  });
});

// Get all responses (for admin purposes)
app.get('/api/responses', (req, res) => {
  const query = `
    SELECT r.*, u.name as user_name 
    FROM responses r
    LEFT JOIN users u ON r.user_id = u.id
    ORDER BY r.response_time DESC
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch responses' });
    }
    
    res.json(rows);
  });
});

// Get statistics
app.get('/api/stats', (req, res) => {
  const query = `
    SELECT 
      COUNT(*) as total_responses,
      SUM(CASE WHEN is_correct = 1 THEN 1 ELSE 0 END) as correct_responses,
      email_type,
      user_response
    FROM responses
    GROUP BY email_type, user_response
  `;
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch statistics' });
    }
    
    res.json(rows);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle process termination
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});
