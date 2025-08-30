const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  details: [
    {
      subject: String,
      date: String,
      day: String,
      time: String
    }
  ]
});

module.exports = mongoose.model('Exam', ExamSchema);
