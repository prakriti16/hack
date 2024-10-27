const mongoose = require('mongoose');

const pendingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  doctor: { type: String, required: true },
  medicines: [
    {
      name: { type: String, required: true },
      qty: { type: Number, required: true },
      checked: { type: Boolean, default: false }
    }
  ],
  status: { type: String, required: true, default: 'pending' },
});

const Pending = mongoose.model('Pending', pendingSchema, 'pending');

module.exports = Pending;
