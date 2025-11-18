const Collection = require('../models/Collection');
const Note = require('../models/Note');
const Favorite = require('../models/Favorite');
const History = require('../models/History');

// Get dashboard page with overview data
exports.getDashboard = async (req, res) => {
  try {
    // Get counts and recent items
    const [collectionsCount, notesCount, favoritesCount, recentCollections, recentNotes, recentHistory] = await Promise.all([
      Collection.countDocuments({ userId: req.session.userId }),
      Note.countDocuments({ userId: req.session.userId }),
      Favorite.countDocuments({ userId: req.session.userId }),
      Collection.find({ userId: req.session.userId }).sort({ createdAt: -1 }).limit(5),
      Note.find({ userId: req.session.userId }).sort({ createdAt: -1 }).limit(5),
      History.find({ userId: req.session.userId }).sort({ timestamp: -1 }).limit(10)
    ]);

    res.render('dashboard', {
      title: 'Dashboard - Kairo',
      collectionsCount,
      notesCount,
      favoritesCount,
      recentCollections,
      recentNotes,
      recentHistory
    });
  } catch (error) {
    console.error('Error loading dashboard:', error);
    res.render('dashboard', {
      title: 'Dashboard - Kairo',
      collectionsCount: 0,
      notesCount: 0,
      favoritesCount: 0,
      recentCollections: [],
      recentNotes: [],
      recentHistory: [],
      error: 'Failed to load dashboard data'
    });
  }
};

// Get profile page
exports.getProfile = async (req, res) => {
  try {
    const User = require('../models/User');
    const userData = await User.findById(req.session.userId).select('-password');
    
    const [collectionsCount, notesCount, favoritesCount] = await Promise.all([
      Collection.countDocuments({ userId: req.session.userId }),
      Note.countDocuments({ userId: req.session.userId }),
      Favorite.countDocuments({ userId: req.session.userId })
    ]);
    
    res.render('profile', {
      title: 'Profile - Kairo',
      profileUser: userData,
      collectionsCount,
      notesCount,
      favoritesCount
    });
  } catch (error) {
    console.error('Error loading profile:', error);
    res.render('profile', {
      title: 'Profile - Kairo',
      error: 'Failed to load profile'
    });
  }
};

// Get team page
exports.getTeam = async (req, res) => {
  try {
    res.render('team', {
      title: 'Team - Kairo'
    });
  } catch (error) {
    console.error('Error loading team:', error);
    res.render('team', {
      title: 'Team - Kairo',
      error: 'Failed to load team page'
    });
  }
};

// Get recent activity page
exports.getRecent = async (req, res) => {
  try {
    const recentHistory = await History.find({ userId: req.session.userId })
      .sort({ timestamp: -1 })
      .limit(50);

    res.render('recent', {
      title: 'Recent Activity - Kairo',
      recentHistory
    });
  } catch (error) {
    console.error('Error loading recent activity:', error);
    res.render('recent', {
      title: 'Recent Activity - Kairo',
      recentHistory: [],
      error: 'Failed to load recent activity'
    });
  }
};
