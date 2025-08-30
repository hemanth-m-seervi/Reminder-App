const Schedule = require('../models/Schedule');

exports.getSchedule = async (req, res) => {
  const schedule = await Schedule.find({ user: req.user.id });
  res.json(schedule);
};

exports.addSchedule = async (req, res) => {
  const { time, task } = req.body;
  const entry = new Schedule({ user: req.user.id, time, task });
  await entry.save();
  res.json(entry);
};
