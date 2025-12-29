// This is like creating a "phone line" to talk to your database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to create the users table in the database
// This runs when the server starts to make sure the table exists
const createTable = async () => {
  // SQL query to create the table
  // IF NOT EXISTS means "only create if it doesn't already exist"
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,                    -- Auto-incrementing ID for each user
      username VARCHAR(50) UNIQUE NOT NULL,     -- Username (max 50 chars, must be unique)
      password_hash VARCHAR(255) NOT NULL,      -- Hashed password (NOT the actual password!)
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- When the account was created
    );
  `;
  
  // Try to run the query
  try {
    await pool.query(query);  // Execute the SQL query
    console.log('✅ Users table ready!');
  } catch (err) {
    // If something goes wrong, log the error
    console.error('❌ Error creating table:', err);
  }
};

// Export these so other files can use them
// pool = used to run database queries
// createTable = used to set up the table when server starts
module.exports = { pool, createTable };