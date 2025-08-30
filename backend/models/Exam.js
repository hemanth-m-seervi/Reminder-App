const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject: String,
  date: String,
  marks: Number,
});

module.exports = mongoose.model('Exam', ExamSchema);
