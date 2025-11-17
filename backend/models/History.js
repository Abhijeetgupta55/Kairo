const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  actionType: {
    type: String,
    required: true,
    enum: ['collection_created', 'collection_updated', 'collection_deleted', 
           'note_created', 'note_updated', 'note_deleted',
           'favorite_added', 'favorite_removed', 
           'link_visited', 'search_performed']
  },
  itemReference: {
    type: String,
    trim: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

// Index for faster queries (descending order for recent first)
historySchema.index({ userId: 1, timestamp: -1 });

module.exports = mongoose.model('History', historySchema);
