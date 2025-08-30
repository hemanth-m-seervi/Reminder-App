const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  day: String,
  subject: String,
  startTime: String,
  endTime: String,
});

module.exports = mongoose.model('Timetable', TimetableSchema);
