const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: String,
  task: String,
  date: String,
});

module.exports = mongoose.model('Schedule', ScheduleSchema);
