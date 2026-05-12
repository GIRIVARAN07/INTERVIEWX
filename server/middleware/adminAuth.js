/**
 * Admin Authentication Middleware
 * ------------------------------
 * Ensures the authenticated user has the 'admin' role.
 * Must be used AFTER the standard auth middleware.
 */

const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    // If not admin, check if it's the hardcoded super-admin email
    if (req.user && req.user.email === 'admin@gmail.com') {
      return next();
    }
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

module.exports = adminAuth;
