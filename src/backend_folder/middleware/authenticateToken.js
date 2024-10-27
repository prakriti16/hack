// authenticateToken.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, 'secretkey', async (err, decoded) => {
    if (err) {
      console.error('Error verifying token:', err);
      return res.status(403).json({ message: 'Invalid token' });
    }

    try {
      if (!decoded || !decoded.id) {
        return res.status(403).json({ message: 'Invalid token payload' });
      }

      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = { id: decoded.id };
      next();
    } catch (error) {
      console.error('Error authenticating token:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
};

module.exports = authenticateToken;
