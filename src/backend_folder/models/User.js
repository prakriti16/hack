
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    branch: { type: String, required: true },
    password: { type: String, required: true },
    position: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' 
      },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
