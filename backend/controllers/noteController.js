const Note = require('../models/Note');
const History = require('../models/History');

// Get all notes for logged-in user
exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.session.userId })
      .sort({ isPinned: -1, createdAt: -1 });

    res.render('notes', {
      title: 'Notes - Kairo',
      notes
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.render('notes', {
      title: 'Notes - Kairo',
      notes: [],
      error: 'Failed to load notes'
    });
  }
};

// API: Get all notes as JSON
exports.getNotesAPI = async (req, res) => {
  try {
    const notes = await Note.find({ userId: req.session.userId })
      .sort({ isPinned: -1, createdAt: -1 });

    res.json({
      success: true,
      notes
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notes'
    });
  }
};

// API: Create new note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note title is required'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const note = new Note({
      userId: req.session.userId,
      title: title.trim(),
      content: content.trim(),
      tags: tags || []
    });

    await note.save();

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'note_created',
      itemReference: note.title,
      details: { noteId: note._id }
    });

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create note'
    });
  }
};

// API: Update note
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags, isPinned } = req.body;

    const note = await Note.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    if (title) note.title = title.trim();
    if (content) note.content = content.trim();
    if (tags !== undefined) note.tags = tags;
    if (isPinned !== undefined) note.isPinned = isPinned;

    await note.save();

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'note_updated',
      itemReference: note.title,
      details: { noteId: note._id }
    });

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update note'
    });
  }
};

// API: Delete note
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: req.session.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    // Add to history
    await History.create({
      userId: req.session.userId,
      actionType: 'note_deleted',
      itemReference: note.title,
      details: { noteId: note._id }
    });

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete note'
    });
  }
};

// API: Toggle pin status
exports.togglePin = async (req, res) => {
  try {
    const { id } = req.params;

    const note = await Note.findOne({
      _id: id,
      userId: req.session.userId
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    note.isPinned = !note.isPinned;
    await note.save();

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Error toggling pin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle pin'
    });
  }
};
