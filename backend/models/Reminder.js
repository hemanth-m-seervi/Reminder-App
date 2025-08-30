const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  deadline: String,
  completed: { type: Boolean, default: false },
});

module.exports = mongoose.model('Reminder', ReminderSchema);
