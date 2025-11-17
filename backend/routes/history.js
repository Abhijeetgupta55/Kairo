const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');
const { requireAuth } = require('../middleware/auth');

// All history routes require authentication
router.use(requireAuth);

// Page route
router.get('/', historyController.getHistory);

// API routes
router.get('/api', historyController.getHistoryAPI);
router.post('/api', historyController.addHistory);
router.delete('/api', historyController.clearHistory);
router.delete('/api/:id', historyController.deleteHistoryEntry);

module.exports = router;
