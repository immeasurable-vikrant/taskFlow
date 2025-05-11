const jwt = require('jsonwebtoken');
const { logError } = require('../utils/logger');

// Middleware to authenticate token from cookie
const authenticateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      
      // Add user ID to request object for use in protected routes
      req.userId = decoded.userId;
      next();
    });
  } catch (error) {
    logError('Authentication middleware error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { authenticateToken };