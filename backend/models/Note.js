const mongoose = require('mongoose');

const SubjectSessionSchema = new mongoose.Schema({
  subject: String,
  notes: [
    {
      note: String,
      pdfUrl: String,
    }
  ]
});

const NoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  classOrSem: String,
  subjects: [SubjectSessionSchema],
});

module.exports = mongoose.model('Note', NoteSchema);
