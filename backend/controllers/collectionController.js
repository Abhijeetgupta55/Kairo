const Collection = require('../models/Collection');
const History = require('../models/History');

// Get all collections for logged-in user
exports.getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });

    res.render('collections', {
      title: 'Collections - Kairo',
      collections
    });
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.render('collections', {
      title: 'Collections - Kairo',
      collections: [],
      error: 'Failed to load collections'
    });
  }
};

// API: Get all collections as JSON
exports.getCollectionsAPI = async (req, res) => {
  try {
    const collections = await Collection.find({ userId: req.session.userId })
      .sort({ createdAt: -1 });

    res.json(collections);
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json([]);
  }
};

// API: Create new collection
exports.createCollection = async (req, res) => {
  try {
    const { name, icon } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Collection name is required'
      });
    }

    const collection = new Collection({
      userId: req.session.userId,
      name: name.trim(),
      icon: icon || '📚',
      items: []
    });

    await collection.save();

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'collection_created',
      itemReference: collection.name,
      details: { collectionId: collection._id }
    });

    res.json(collection);
  } catch (error) {
    console.error('Error creating collection:', error);
    res.status(500).json({ error: 'Failed to create collection' });
  }
};

// API: Update collection
exports.updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, items } = req.body;

    const collection = await Collection.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    if (name) collection.name = name.trim();
    if (icon) collection.icon = icon;
    if (items !== undefined) collection.links = items;

    await collection.save();

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'collection_updated',
      itemReference: collection.name,
      details: { collectionId: collection._id }
    });

    res.json(collection);
  } catch (error) {
    console.error('Error updating collection:', error);
    res.status(500).json({ error: 'Failed to update collection' });
  }
};

// API: Delete collection
exports.deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findOneAndDelete({
      _id: id,
      userId: req.session.userId
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'collection_deleted',
      itemReference: collection.name,
      details: { collectionId: collection._id }
    });

    res.json({
      success: true,
      message: 'Collection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting collection:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete collection'
    });
  }
};

// API: Add link to collection
exports.addLink = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url } = req.body;

    if (!title || !url) {
      return res.status(400).json({
        success: false,
        message: 'Title and URL are required'
      });
    }

    const collection = await Collection.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    collection.items.unshift({
      title: title.trim(),
      url: url.trim()
    });

    await collection.save();

    res.json({
      success: true,
      collection
    });
  } catch (error) {
    console.error('Error adding link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add link'
    });
  }
};

// API: Remove link from collection
exports.removeLink = async (req, res) => {
  try {
    const { id, linkId } = req.params;

    const collection = await Collection.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!collection) {
      return res.status(404).json({
        success: false,
        message: 'Collection not found'
      });
    }

    collection.items = collection.items.filter(
      item => item._id.toString() !== linkId
    );

    await collection.save();

    res.json({
      success: true,
      collection
    });
  } catch (error) {
    console.error('Error removing link:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove link'
    });
  }
};
