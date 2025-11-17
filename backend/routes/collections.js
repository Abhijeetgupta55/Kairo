const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collectionController');
const { requireAuth } = require('../middleware/auth');

// All collection routes require authentication
router.use(requireAuth);

// Page route
router.get('/', collectionController.getCollections);

// API routes
router.get('/api', collectionController.getCollectionsAPI);
router.post('/api', collectionController.createCollection);
router.put('/api/:id', collectionController.updateCollection);
router.delete('/api/:id', collectionController.deleteCollection);

// Link management
router.post('/api/:id/links', collectionController.addLink);
router.delete('/api/:id/links/:linkId', collectionController.removeLink);

module.exports = router;
