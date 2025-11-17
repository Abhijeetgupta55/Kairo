const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');
const { requireAuth } = require('../middleware/auth');

// All note routes require authentication
router.use(requireAuth);

// Page route
router.get('/', noteController.getNotes);

// API routes
router.get('/api', noteController.getNotesAPI);
router.post('/api', noteController.createNote);
router.put('/api/:id', noteController.updateNote);
router.delete('/api/:id', noteController.deleteNote);

// Toggle pin
router.patch('/api/:id/pin', noteController.togglePin);

module.exports = router;
