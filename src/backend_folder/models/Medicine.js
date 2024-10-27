const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  form: { type: String, required: true },
  strength: { type: String, required: true },
  instructions: { type: String, required: true },
  category: { type: String, required: true },
  department: { type: String, required: true },
});

const Medicine = mongoose.model('Medicine', medicineSchema, 'medicine');

module.exports = Medicine;
