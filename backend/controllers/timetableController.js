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
