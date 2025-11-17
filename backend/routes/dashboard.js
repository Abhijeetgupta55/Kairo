const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireAuth } = require('../middleware/auth');

// All dashboard routes require authentication
router.use(requireAuth);

router.get('/', dashboardController.getDashboard);
router.get('/profile', dashboardController.getProfile);
router.get('/team', dashboardController.getTeam);
router.get('/recent', dashboardController.getRecent);

module.exports = router;
