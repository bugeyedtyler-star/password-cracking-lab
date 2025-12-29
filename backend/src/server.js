// Import required packages
const express = require('express');        // Web framework for building the API
const cors = require('cors');              // Allows frontend (different port) to talk to backend
const { createTable } = require('./database');  // Our database setup function
const routes = require('./routes');        // Our API endpoints (signup, login, etc.)

// Create an Express application
const app = express();

// Set the port our server will listen on
const PORT = 5000;

// ==================== MIDDLEWARE ====================
// Middleware = code that runs BEFORE your routes
// Think of it as a "security checkpoint" that processes requests first

// Enable CORS - lets your React app (port 3000) talk to this API (port 5000)
// Without this, browser blocks the connection for security reasons
app.use(cors());

// Parse incoming JSON data in request bodies
// This lets us read data like { username: "test", password: "123" }
app.use(express.json());

// ==================== DATABASE INITIALIZATION ====================
// Create the users table when server starts (if it doesn't exist yet)
createTable();

// ==================== ROUTES ====================
// Mount all our API routes under the /api path
// So /api/signup, /api/login, etc. will all work
app.use('/api', routes);

// ==================== START SERVER ====================
// Tell the server to start listening for requests
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});