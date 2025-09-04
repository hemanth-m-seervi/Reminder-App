const mongoose = require('mongoose');

const ScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: String,
  task: String,
  date: String,
});

// Remove all schedule tasks whose date+time is before now for a user
ScheduleSchema.statics.cleanPast = async function(userId) {
  const now = new Date();
  await this.deleteMany({
    user: userId,
    $expr: {
      $lt: [
        { $dateFromString: { dateString: { $concat: ["$date", "T", "$time"] } } },
        now
      ]
    }
  });
};

module.exports = mongoose.model('Schedule', ScheduleSchema);
