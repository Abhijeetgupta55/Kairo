const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { requireAuth } = require('../middleware/auth');

// All favorite routes require authentication
router.use(requireAuth);

// Page route
router.get('/', favoriteController.getFavorites);

// API routes
router.get('/api', favoriteController.getFavoritesAPI);
router.post('/api', favoriteController.addFavorite);
router.put('/api/:id', favoriteController.updateFavorite);
router.delete('/api/:id', favoriteController.deleteFavorite);

// Toggle star
router.patch('/api/:id/star', favoriteController.toggleStar);

// Increment click count
router.post('/api/:id/click', favoriteController.incrementClick);

module.exports = router;
