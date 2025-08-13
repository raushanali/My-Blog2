// Authentication routes
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { requireGuest, requireAuth } = require('../middleware/auth');

// Show signup form
router.get('/signup', requireGuest, (req, res) => {
  res.render('signup', {
    title: 'Sign Up - My Blog',
    errors: null,
    formData: {}
  });
});

// Handle signup
router.post('/signup', requireGuest, (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  
  // Validation
  const errors = [];
  
  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  }
  
  if (!email || !email.includes('@')) {
    errors.push('Please enter a valid email');
  }
  
  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  
  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }
  
  if (User.findByEmail(email)) {
    errors.push('Email already registered');
  }
  
  if (User.findByUsername(username)) {
    errors.push('Username already taken');
  }
  
  if (errors.length > 0) {
    return res.render('signup', {
      title: 'Sign Up - My Blog',
      errors,
      formData: req.body
    });
  }
  
  // Create user
  const user = User.create({
    username: username.trim(),
    email: email.trim(),
    password: password // Note: In production, use bcrypt
  });
  
  req.session.userId = user.id;
  res.redirect('/');
});

// Show login form
router.get('/login', requireGuest, (req, res) => {
  res.render('login', {
    title: 'Login - My Blog',
    error: null,
    formData: {}
  });
});

// Handle login
router.post('/login', requireGuest, (req, res) => {
  const { email, password } = req.body;
  
  const user = User.findByEmail(email);
  
  if (!user || user.password !== password) {
    return res.render('login', {
      title: 'Login - My Blog',
      error: 'Invalid email or password',
      formData: req.body
    });
  }
  
  req.session.userId = user.id;
  res.redirect('/');
});

// Handle logout
router.post('/logout', requireAuth, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

module.exports = router;
