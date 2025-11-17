// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      // If it's an AJAX request, return JSON
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }
    // Otherwise redirect to login
    return res.redirect('/login');
  }
  next();
};

// Middleware to check if user is already logged in (for login/signup pages)
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/dashboard');
  }
  next();
};

// Middleware to attach user data to all views
const attachUser = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const User = require('../models/User');
      const user = await User.findById(req.session.userId).select('-password');
      res.locals.user = user;
      res.locals.isAuthenticated = true;
    } catch (error) {
      console.error('Error fetching user:', error);
      res.locals.user = null;
      res.locals.isAuthenticated = false;
    }
  } else {
    res.locals.user = null;
    res.locals.isAuthenticated = false;
  }
  next();
};

module.exports = {
  requireAuth,
  redirectIfAuthenticated,
  attachUser
};
