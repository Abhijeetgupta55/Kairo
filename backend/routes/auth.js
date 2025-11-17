const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { redirectIfAuthenticated } = require('../middleware/auth');

// Signup routes
router.get('/signup', redirectIfAuthenticated, authController.getSignup);
router.post('/signup', redirectIfAuthenticated, authController.postSignup);

// Login routes
router.get('/login', redirectIfAuthenticated, authController.getLogin);
router.post('/login', redirectIfAuthenticated, authController.postLogin);

// Logout route
router.get('/logout', authController.logout);
router.post('/logout', authController.logout);

module.exports = router;
