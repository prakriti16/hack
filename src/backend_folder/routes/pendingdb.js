const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Pending = require('../models/Pending'); 

// GET all pending entries
router.get('/', async (req, res) => {
  try {
    const pendings = await Pending.find();
    res.json(pendings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// DELETE a specific medicine from a pending entry by ID and index
router.delete('/medicines', async (req, res) => {
  const { email, date, doctor, medicineIndex } = req.body; // Send these in the request body
  try {
    // Find the document based on email and date
    const appointment = await Pending.findOne({ email, date, doctor });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    console.log(appointment);
    // Check if the medicine index is valid
    if (medicineIndex < 0 || medicineIndex >= appointment.medicines.length) {
      return res.status(400).json({ message: 'Invalid medicine index' });
    }

    // Remove the medicine from the array
    appointment.medicines.splice(medicineIndex, 1);
    
    // Save the updated appointment
    await appointment.save();

    res.json({ message: 'Medicine cancelled successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
// POST a new pending entry
router.post('/', [
  body('name').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('date').notEmpty().isISO8601().toDate(),
  body('doctor').notEmpty().trim().escape(),
  body('medicines').isArray({ min: 1 }), // Ensure 'medicines' is an array
  body('medicines.*.name').notEmpty().trim().escape(),
  body('medicines.*.qty').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, date, doctor, medicines, status } = req.body;

  const newMed = new Pending({
    name,
    email,
    date,
    doctor,
    medicines, // Array of { name, qty } objects
    status
  });

  try {
    const savedMed = await newMed.save();
    res.status(201).json(savedMed);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a pending entry by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedMed = await Pending.findByIdAndDelete(req.params.id);
    if (!deletedMed) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT (update) a pending entry by ID
router.put('/:id', [
  body('name').optional().notEmpty().trim().escape(),
  body('email').optional().isEmail().normalizeEmail(),
  body('date').optional().isISO8601().toDate(),
  body('doctor').optional().notEmpty().trim().escape(),
  body('medicines').optional().isArray(),
  body('medicines.*.name').optional().notEmpty().trim().escape(),
  body('medicines.*.qty').optional().isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  body('medicines.*.checked').optional().isBoolean(), // Validate checked field
  body('status').optional().notEmpty().trim().escape()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const medid = req.params.id;
  const updatedMed = req.body;

  try {
    const updated = await Pending.findByIdAndUpdate(medid, updatedMed, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Entry not found' });
    }
    res.json({ message: 'Entry updated successfully', med: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET with search functionality
router.get('/search', async (req, res) => {
  const { category, keyword } = req.query;

  if (!category) {
    return res.status(400).json({ message: 'Category is required' });
  }

  let filter = {};
  if (category === 'name') {
    filter.name = new RegExp(keyword, 'i');
  } else if (category === 'doctor') {
    filter.doctor = new RegExp(keyword, 'i');
  } else if (category === 'status') {
    filter.status = new RegExp(keyword, 'i');
  } else {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    const pendings = await Pending.find(filter);
    res.json(pendings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
