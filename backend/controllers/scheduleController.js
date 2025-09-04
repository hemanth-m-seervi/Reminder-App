const Schedule = require('../models/Schedule');

exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.find({ user: req.user.id });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

exports.addSchedule = async (req, res) => {
  const { time, task, date } = req.body;
  const entry = new Schedule({ user: req.user.id, time, task, date });
  await entry.save();
  res.json(entry);
};

// Remove past schedule tasks from DB
exports.cleanPastSchedule = async (req, res) => {
  const now = new Date();
  // Remove tasks whose date+time is before now
  await Schedule.deleteMany({
    user: req.user.id,
    $expr: {
      $lt: [
        { $dateFromString: { dateString: { $concat: ["$date", "T", "$time"] } } },
        now
      ]
    }
  });
  res.json({ success: true });
};

exports.deleteSchedule = async (req, res) => {
  try {
    const scheduleId = req.params.id;
    const deleted = await Schedule.findOneAndDelete({ _id: scheduleId, user: req.user.id });
    if (!deleted) return res.status(404).json({ msg: 'Schedule not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
