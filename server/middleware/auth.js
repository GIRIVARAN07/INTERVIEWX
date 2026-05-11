/**
 * Authentication Middleware
 * ------------------------
 * Verifies the JWT token sent in the Authorization header.
 * Attaches the decoded user payload to req.user if valid.
 * Returns 401 if no token is provided or token is invalid.
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from the Authorization header (format: "Bearer <token>")
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using our secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, name, email }
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
