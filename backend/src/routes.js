// Import required packages
const express = require('express');    // Web framework
const bcrypt = require('bcrypt');      // Password hashing library (makes passwords secure!)
const { pool } = require('./database'); // Database connection

// Create a router - this handles all our API endpoints
const router = express.Router();

// ==================== SIGNUP ENDPOINT ====================
// POST /api/signup - Creates a new user account
router.post('/signup', async (req, res) => {
  // Extract username and password from request body
  // req.body comes from the frontend when they submit the form
  const { username, password } = req.body;
  
  // Validate that both fields were provided
  if (!username || !password) {
    // Send back error with 400 status code (bad request)
    return res.status(400).json({ error: 'Username and password required!' });
  }
  
  try {
    // ========== PASSWORD HASHING (THE SECURITY MAGIC!) ==========
    // Never store passwords as plain text!
    // bcrypt "scrambles" the password so even if someone steals the database,
    // they can't read the actual passwords
    
    const saltRounds = 10;  // How many times to scramble (10 is secure and fast)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Example: "password123" becomes something like:
    // "$2b$10$N9qo8uLOickgx2ZMRZoMye.IjefGkjfaljsdfkljasdf"
    
    // ========== SAVE TO DATABASE ==========
    // $1 and $2 are placeholders that get replaced with our values
    // This prevents SQL injection attacks (a common hack)
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]  // These replace $1 and $2
    );
    
    // Send success response back to frontend
    res.status(201).json({ 
      message: 'Account created! 🎉', 
      user: result.rows[0]  // Send back the new user info (without password!)
    });
    
  } catch (err) {
    // ========== ERROR HANDLING ==========
    
    // Error code 23505 = duplicate username (username already exists)
    if (err.code === '23505') {
      res.status(409).json({ error: 'Username already exists!' });
    } else {
      // Some other error happened
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// ==================== LOGIN ENDPOINT ====================
// POST /api/login - Checks if username/password are correct
router.post('/login', async (req, res) => {
  // Get username and password from request
  const { username, password } = req.body;
  
  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required!' });
  }
  
  try {
    // ========== FIND USER IN DATABASE ==========
    // Look up the user by username
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    // If no user found with that username
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials!' });
    }
    
    // Get the user data (including their hashed password)
    const user = result.rows[0];
    
    // ========== COMPARE PASSWORDS ==========
    // bcrypt.compare checks if the password they entered matches the hash
    // It hashes the entered password and compares it to the stored hash
    // This is secure because we never "unhash" the stored password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    
    if (isMatch) {
      // Password is correct! Let them in
      res.json({ message: 'Login successful! 🔓', username: user.username });
    } else {
      // Password is wrong
      res.status(401).json({ error: 'Invalid credentials!' });
    }
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ==================== ADMIN ENDPOINT (YOUR SECRET WEAPON!) ====================
// GET /api/admin/hashes - Shows all usernames and password hashes
// This is what YOU use to crack passwords later!
router.get('/admin/hashes', async (req, res) => {
  try {
    // Get all users from database, ordered by newest first
    const result = await pool.query('SELECT id, username, password_hash, created_at FROM users ORDER BY created_at DESC');
    
    // ========== BUILD HTML TABLE ==========
    // Instead of sending JSON, we build a nice-looking HTML page
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Password Hashes - Admin Panel</title>
        <style>
          /* Dark hacker theme CSS styles */
          body { 
            font-family: 'Courier New', monospace; 
            background: #0d1117; 
            color: #c9d1d9; 
            padding: 20px;
          }
          h1 { color: #58a6ff; }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            background: #161b22;
          }
          th { 
            background: #21262d; 
            padding: 12px; 
            text-align: left; 
            border-bottom: 2px solid #30363d;
            color: #58a6ff;
          }
          td { 
            padding: 10px; 
            border-bottom: 1px solid #30363d; 
          }
          tr:hover { background: #1c2128; }
          .hash { 
            font-family: monospace; 
            font-size: 12px; 
            color: #f85149;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <h1>🔓 Password Hashes - Admin Panel</h1>
        <p>Total users: ${result.rows.length}</p>
        <table>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Password Hash</th>
            <th>Created</th>
          </tr>
    `;
    
    // Loop through each user and add a table row
    result.rows.forEach(user => {
      html += `
        <tr>
          <td>${user.id}</td>
          <td>${user.username}</td>
          <td class="hash">${user.password_hash}</td>
          <td>${new Date(user.created_at).toLocaleString()}</td>
        </tr>
      `;
    });
    
    // Close the HTML
    html += `
        </table>
      </body>
      </html>
    `;
    
    // Send the HTML page
    res.send(html);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Export the router so server.js can use it
module.exports = router;