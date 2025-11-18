const History = require('../models/History');

// Get history page
exports.getHistory = async (req, res) => {
  try {
    const Favorite = require('../models/Favorite');
    
    // Only fetch visited links, not other history types
    const history = await History.find({ 
      userId: req.session.userId,
      actionType: 'link_visited'
    })
      .sort({ timestamp: -1 })
      .limit(100);

    // Get all favorites to check star status
    const favorites = await Favorite.find({ userId: req.session.userId });
    const favoriteUrls = new Set(favorites.map(f => f.url));

    // Add isFavorite flag to each history item
    const historyWithFavorites = history.map(item => ({
      ...item.toObject(),
      isFavorite: favoriteUrls.has(item.details?.url)
    }));

    res.render('history', {
      title: 'History - Kairo',
      history: historyWithFavorites
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.render('history', {
      title: 'History - Kairo',
      history: [],
      error: 'Failed to load history'
    });
  }
};

// API: Get history as JSON
exports.getHistoryAPI = async (req, res) => {
  try {
    const { limit = 100, skip = 0 } = req.query;

    const history = await History.find({ userId: req.session.userId })
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip));

    const total = await History.countDocuments({ userId: req.session.userId });

    res.json({
      success: true,
      history,
      total,
      hasMore: total > parseInt(skip) + parseInt(limit)
    });
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch history'
    });
  }
};

// API: Add history entry
exports.addHistory = async (req, res) => {
  try {
    const { actionType, itemReference, details } = req.body;

    if (!actionType) {
      return res.status(400).json({
        success: false,
        message: 'Action type is required'
      });
    }

    const historyEntry = new History({
      userId: req.session.userId,
      actionType,
      itemReference: itemReference || '',
      details: details || {}
    });

    await historyEntry.save();

    res.json({
      success: true,
      historyEntry
    });
  } catch (error) {
    console.error('Error adding history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add history'
    });
  }
};

// API: Clear history
exports.clearHistory = async (req, res) => {
  try {
    await History.deleteMany({ userId: req.session.userId });

    res.json({
      success: true,
      message: 'History cleared successfully'
    });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear history'
    });
  }
};

// API: Delete specific history entry
exports.deleteHistoryEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const historyEntry = await History.findOneAndDelete({
      _id: id,
      userId: req.session.userId
    });

    if (!historyEntry) {
      return res.status(404).json({
        success: false,
        message: 'History entry not found'
      });
    }

    res.json({
      success: true,
      message: 'History entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting history entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete history entry'
    });
  }
};
