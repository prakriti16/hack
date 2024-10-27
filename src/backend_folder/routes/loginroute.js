const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User'); 
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const authenticateToken = require('../middleware/authenticateToken'); // Import your authentication middleware
const jwt = require('jsonwebtoken');
require('dotenv').config();
router.get('/', async (req, res) => {
    try {
        const user = await User.find();
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/', [
  body('name').notEmpty().trim().escape().withMessage('Name is required'),
  body('roll').notEmpty().trim().escape().withMessage('Roll number is required'),
  body('email').notEmpty().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('branch').notEmpty().trim().escape().withMessage('Branch is required'),
  body('password').notEmpty().trim().escape().withMessage('Password is required'),
  body('position').notEmpty().trim().escape().withMessage('Position is required')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
  }

  const { name, roll, email, branch, password, position } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const newUser = new User({
      name,
      roll,
      email,
      branch,
      password: hashedPassword,
      position,
  });

  try {

        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'user not found' });
        }
        res.json({ message: 'user entry deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/search', async (req, res) => {
    const { category, keyword } = req.query;
  
    // Ensure both category and keyword are provided
    if (!category || !keyword) {
      return res.status(400).json({ message: 'Category and keyword are required' });
    }
  
    // Define the filter based on the query parameters
    const filter = {};
    filter[category] = { $regex: new RegExp(keyword, 'i') }; // Case-insensitive search
  
    try {
      const user = await User.find(filter);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

router.put('/:id', async (req, res) => {
    const userId = req.params.id;
    const updatedUser = req.body;
  
    try {
      const updated = await User.findByIdAndUpdate(userId, updatedUser, { new: true });
      if (!updated) {
        return res.status(404).json({ message: 'Profile not found' });
      }
      res.json({ message: 'Profile updated successfully', profile: updated });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  router.post('/login', async (req, res) => {
    const { roll, password } = req.body;
    try {
      const user = await User.findOne({ roll });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const passwordIsValid = bcrypt.compareSync(password, user.password);
  
      if (!passwordIsValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign({ id: user._id, roll: user.roll }, 'secretkey', { expiresIn: '1d' });
  
      res.status(200).json({ message: 'Login successful!', userId: user._id, token, auth: true });
    } catch (err) {
      console.error('Error during login:', err); // Debugging line
      res.status(500).json({ message: err.message });
    }
  });
router.get('/profile', authenticateToken, async (req, res) => {
  try {
   // console.log("hereeeeee");
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
   // console.log(user);
    res.json(user);
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports = router;
