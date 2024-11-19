const express = require('express');
const router = express.Router();

// User data (in-memory storage for demonstration)
let users = [];

// Register user
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = {
    id: Date.now().toString(),
    username,
    email,
    password, // In a real app, this should be hashed
    createdAt: new Date()
  };
  
  users.push(user);
  res.status(201).json({ message: 'User created successfully' });
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ message: 'Login successful', userId: user.id });
});

// Get user profile
router.get('/profile/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const { password, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

module.exports = router;