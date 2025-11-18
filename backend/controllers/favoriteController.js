const Favorite = require('../models/Favorite');
const History = require('../models/History');

// Get all favorites for logged-in user
exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.session.userId })
      .sort({ star: -1, createdAt: -1 });

    res.render('favorites', {
      title: 'Favorites - Kairo',
      favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.render('favorites', {
      title: 'Favorites - Kairo',
      favorites: [],
      error: 'Failed to load favorites'
    });
  }
};

// API: Get all favorites as JSON
exports.getFavoritesAPI = async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.session.userId })
      .sort({ star: -1, createdAt: -1 });

    res.json({
      success: true,
      favorites
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch favorites'
    });
  }
};

// API: Add new favorite
exports.addFavorite = async (req, res) => {
  try {
    const { title, url, favicon } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Favorite title is required'
      });
    }

    if (!url || !url.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Favorite URL is required'
      });
    }

    // Check if URL already exists in favorites
    const existing = await Favorite.findOne({
      userId: req.session.userId,
      url: url.trim()
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This URL is already in your favorites',
        favorite: existing
      });
    }

    const favorite = new Favorite({
      userId: req.session.userId,
      title: title.trim(),
      url: url.trim(),
      favicon: favicon || ''
    });

    await favorite.save();

    // Add to history - both favorite_added and link_visited for recents
    await History.create([
      {
        userId: req.session.userId,
        actionType: 'favorite_added',
        itemReference: favorite.title,
        details: { favoriteId: favorite._id, url: favorite.url }
      },
      {
        userId: req.session.userId,
        actionType: 'link_visited',
        itemReference: favorite.title,
        details: { 
          url: favorite.url,
          source: 'favorites'
        }
      }
    ]);

    res.json({
      success: true,
      favorite
    });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add favorite'
    });
  }
};

// API: Update favorite
exports.updateFavorite = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, url, star, favicon } = req.body;

    const favorite = await Favorite.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    if (title) favorite.title = title.trim();
    if (url) favorite.url = url.trim();
    if (star !== undefined) favorite.star = star;
    if (favicon !== undefined) favorite.favicon = favicon;

    await favorite.save();

    res.json({
      success: true,
      favorite
    });
  } catch (error) {
    console.error('Error updating favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update favorite'
    });
  }
};

// API: Delete favorite
exports.deleteFavorite = async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOneAndDelete({
      _id: id,
      userId: req.session.userId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'favorite_removed',
      itemReference: favorite.title,
      details: { favoriteId: favorite._id }
    });

    res.json({
      success: true,
      message: 'Favorite deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete favorite'
    });
  }
};

// API: Increment click count
exports.incrementClick = async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    favorite.clicks += 1;
    await favorite.save();

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'link_visited',
      itemReference: favorite.title,
      details: { favoriteId: favorite._id, url: favorite.url }
    });

    res.json({
      success: true,
      favorite
    });
  } catch (error) {
    console.error('Error incrementing click:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to increment click'
    });
  }
};

// API: Toggle star status
exports.toggleStar = async (req, res) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    favorite.star = !favorite.star;
    await favorite.save();

    res.json({
      success: true,
      favorite
    });
  } catch (error) {
    console.error('Error toggling star:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle star'
    });
  }
};
