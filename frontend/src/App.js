// Import React and useState hook
// React = the library that makes this all work
// useState = lets us store and update data (like username, password, messages)
import React, { useState } from 'react';

// Main component - this is the entire app
export default function PasswordLab() {
  
  // ==================== STATE VARIABLES ====================
  // State = data that can change and causes the page to re-render
  // Think of these as "variables that React watches"
  
  // Track whether we're in 'login' or 'signup' mode
  const [mode, setMode] = useState('login');
  
  // Store what the user types in the username field
  const [username, setUsername] = useState('');
  
  // Store what the user types in the password field
  const [password, setPassword] = useState('');
  
  // Store success/error messages to show the user
  const [message, setMessage] = useState('');
  
  // Track if message is 'success' or 'error' (changes the color)
  const [messageType, setMessageType] = useState('');

  // ==================== SIGNUP FUNCTION ====================
  // This runs when user clicks "Create Account"
  const handleSignup = async () => {
    // Validate that fields aren't empty
    if (!username || !password) {
      setMessageType('error');
      setMessage('Please fill in all fields!');
      return;  // Stop here if validation fails
    }
    
    setMessage('');  // Clear any previous messages
    
    try {
      // ========== SEND REQUEST TO BACKEND ==========
      // fetch() makes an HTTP request to our backend API
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/signup`, {
        method: 'POST',  // POST = sending data to create something new
        headers: { 'Content-Type': 'application/json' },  // Tell server we're sending JSON
        body: JSON.stringify({ username, password })  // Convert data to JSON format
      });
      
      // Parse the response from the backend
      const data = await response.json();
      
      // ========== HANDLE RESPONSE ==========
      if (response.ok) {
        // Success! Account was created
        setMessageType('success');
        setMessage(`Welcome aboard, ${username}! Your password is totally safe... probably. 🎉`);
        
        // Clear the form fields
        setUsername('');
        setPassword('');
      } else {
        // Error! Something went wrong (username taken, etc.)
        setMessageType('error');
        setMessage(data.error || 'Something went wrong!');
      }
    } catch (err) {
      // Network error - backend isn't running or can't be reached
      setMessageType('error');
      setMessage('Unable to connect to server. Is it running?');
    }
  };

  // ==================== LOGIN FUNCTION ====================
  // This runs when user clicks "Login"
  const handleLogin = async () => {
    // Validate input
    if (!username || !password) {
      setMessageType('error');
      setMessage('Please fill in all fields!');
      return;
    }
    
    setMessage('');  // Clear previous messages
    
    try {
      // ========== SEND REQUEST TO BACKEND ==========
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await response.json();
      
      // ========== HANDLE RESPONSE ==========
      if (response.ok) {
        // Success! Login worked
        setMessageType('success');
        setMessage(`Access granted, ${username}! You're in. 🔓`);
        
        // Clear form
        setUsername('');
        setPassword('');
      } else {
        // Error! Wrong username or password
        setMessageType('error');
        setMessage(data.error || 'Invalid credentials!');
      }
    } catch (err) {
      // Network error
      setMessageType('error');
      setMessage('Unable to connect to server. Is it running?');
    }
  };

  // ==================== KEYBOARD HELPER ====================
  // Lets users press Enter to submit instead of clicking button
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      mode === 'signup' ? handleSignup() : handleLogin();
    }
  };

  // ==================== RENDER THE UI ====================
  // Everything below is what actually shows on the page
  // It's JSX - looks like HTML but it's actually JavaScript
  
  return (
    <div style={{
      // Main container - full screen with gradient background
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: '20px'
    }}>
      
      {/* ========== HEADER SECTION ========== */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        {/* Main title with gradient text */}
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #00d4ff 0%, #00ffcc 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '10px',
          letterSpacing: '-0.5px'
        }}>
          SecureVault™
        </h1>
        
        {/* Subtitle */}
        <p style={{
          color: '#8892b0',
          fontSize: '0.95rem',
          fontWeight: '400'
        }}>
          "Enterprise-Grade" Password "Security"
        </p>
        
        {/* Disclaimer with pulsing red glow animation */}
        <p style={{
          color: '#ff4444',
          fontSize: '0.75rem',
          fontStyle: 'italic',
          marginTop: '5px',
          textShadow: '0 0 10px rgba(255, 68, 68, 0.8), 0 0 20px rgba(255, 68, 68, 0.5)',
          animation: 'glow 2s ease-in-out infinite alternate, pulse-scale 2s ease-in-out infinite'
        }}>
          {/* CSS animations defined inline */}
          <style>
            {`
              @keyframes glow {
                from { text-shadow: 0 0 10px rgba(255, 68, 68, 0.5), 0 0 20px rgba(255, 68, 68, 0.3); }
                to { text-shadow: 0 0 20px rgba(255, 68, 68, 1), 0 0 30px rgba(255, 68, 68, 0.7), 0 0 40px rgba(255, 68, 68, 0.5); }
              }
              @keyframes pulse-scale {
                0%, 100% { 
                  transform: scale(1);
                  letter-spacing: 0px;
                }
                50% { 
                  transform: scale(1.05);
                  letter-spacing: 0.5px;
                }
              }
            `}
          </style>
          Results may vary. Definitely don't use this for actual security!!!
        </p>
      </div>

      {/* ========== MAIN CARD (FORM AREA) ========== */}
      <div style={{
        // Glassmorphic card with backdrop blur
        background: 'rgba(30, 41, 59, 0.5)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(0, 212, 255, 0.2)',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(0, 212, 255, 0.1)'
      }}>
        
        {/* ========== MODE TOGGLE (LOGIN / SIGNUP) ========== */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '4px',
          borderRadius: '12px'
        }}>
          {/* Login button */}
          <button
            onClick={() => {
              setMode('login');   // Switch to login mode
              setMessage('');     // Clear any messages
            }}
            style={{
              flex: 1,
              padding: '12px',
              // Active mode gets gradient background, inactive is transparent
              background: mode === 'login' ? 'linear-gradient(135deg, #00d4ff 0%, #00ffcc 100%)' : 'transparent',
              color: mode === 'login' ? '#0a0e27' : '#8892b0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Login
          </button>
          
          {/* Signup button */}
          <button
            onClick={() => {
              setMode('signup');  // Switch to signup mode
              setMessage('');     // Clear any messages
            }}
            style={{
              flex: 1,
              padding: '12px',
              background: mode === 'signup' ? 'linear-gradient(135deg, #00d4ff 0%, #00ffcc 100%)' : 'transparent',
              color: mode === 'signup' ? '#0a0e27' : '#8892b0',
              border: 'none',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* ========== FORM INPUTS ========== */}
        <div>
          {/* Username field */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#cbd5e1',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Username
            </label>
            <input
              type="text"
              value={username}  // Controlled input - React manages the value
              onChange={(e) => setUsername(e.target.value)}  // Update state when user types
              onKeyPress={handleKeyPress}  // Allow Enter key to submit
              placeholder="Enter your username"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              // Change border color on focus/blur
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'}
            />
          </div>

          {/* Password field */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              color: '#cbd5e1',
              fontSize: '0.875rem',
              fontWeight: '500',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <input
              type="password"  // Hides the text as dots/asterisks
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(0, 212, 255, 0.3)',
                borderRadius: '8px',
                color: '#e2e8f0',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00d4ff'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 212, 255, 0.3)'}
            />
            
            {/* Funny hint only shows in signup mode */}
            {mode === 'signup' && (
              <p style={{
                color: '#64748b',
                fontSize: '0.75rem',
                marginTop: '6px',
                fontStyle: 'italic'
              }}>
                Pro tip: "password123" is a bold choice
              </p>
            )}
          </div>

          {/* ========== SUBMIT BUTTON ========== */}
          <button
            // Call signup or login function depending on mode
            onClick={mode === 'signup' ? handleSignup : handleLogin}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #00d4ff 0%, #00ffcc 100%)',
              color: '#0a0e27',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0, 212, 255, 0.3)'
            }}
            // Hover effect - lift button up slightly
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 24px rgba(0, 212, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 16px rgba(0, 212, 255, 0.3)';
            }}
          >
            {/* Button text changes based on mode */}
            {mode === 'signup' ? 'Create Account' : 'Login'}
          </button>
        </div>

        {/* ========== SUCCESS/ERROR MESSAGE ========== */}
        {/* Only show if message exists */}
        {message && (
          <div style={{
            marginTop: '20px',
            padding: '12px 16px',
            // Green for success, red for error
            background: messageType === 'success' 
              ? 'rgba(0, 255, 204, 0.1)' 
              : 'rgba(255, 82, 82, 0.1)',
            border: `1px solid ${messageType === 'success' ? 'rgba(0, 255, 204, 0.3)' : 'rgba(255, 82, 82, 0.3)'}`,
            borderRadius: '8px',
            color: messageType === 'success' ? '#00ffcc' : '#ff5252',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}
      </div>

      {/* ========== FOOTER ========== */}
      <div style={{
        marginTop: '40px',
        textAlign: 'center',
        color: '#475569',
        fontSize: '0.8rem'
      }}>
        <p>
          Built by Tyler | Cybersecurity Portfolio Project
        </p>
        <p style={{ marginTop: '8px', fontStyle: 'italic' }}>
          Warning: Your password will be stored securely... until I crack it 😈
        </p>
      </div>
    </div>
  );
}