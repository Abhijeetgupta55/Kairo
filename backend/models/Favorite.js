const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Favorite title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  url: {
    type: String,
    required: [true, 'Favorite URL is required'],
    trim: true
  },
  star: {
    type: Boolean,
    default: false
  },
  clicks: {
    type: Number,
    default: 0
  },
  favicon: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for faster queries
favoriteSchema.index({ userId: 1, createdAt: -1 });
favoriteSchema.index({ userId: 1, star: -1 });

module.exports = mongoose.model('Favorite', favoriteSchema);
