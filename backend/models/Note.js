const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  note: String,
  pdfUrl: String,
});

module.exports = mongoose.model('Note', NoteSchema);
