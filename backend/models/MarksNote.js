const mongoose = require('mongoose');

const MarksNoteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examName: { type: String, required: true },
  subjects: [
    {
      subject: String,
      totalMarks: Number,
      marks: Number,
    }
  ],
});

module.exports = mongoose.model('MarksNote', MarksNoteSchema);
