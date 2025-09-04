const Timetable = require('../models/Timetable');

exports.getTimetable = async (req, res) => {
  const entries = await Timetable.find({ user: req.user.id });
  res.json(entries);
};


exports.addTimetable = async (req, res) => {
  const { day, subject, startTime, endTime } = req.body;
  const entry = new Timetable({ user: req.user.id, day, subject, startTime, endTime });
  await entry.save();
  res.json(entry);
};

exports.deleteTimetable = async (req, res) => {
  try {
    const entry = await Timetable.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!entry) return res.status(404).json({ msg: 'Entry not found' });
    res.json({ msg: 'Deleted', id: req.params.id });
  } catch {
    res.status(500).json({ msg: 'Server error' });
  }
};
