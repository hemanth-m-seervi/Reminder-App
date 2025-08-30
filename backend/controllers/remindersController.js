const Reminder = require('../models/Reminder');

exports.getReminders = async (req, res) => {
  const reminders = await Reminder.find({ user: req.user.id });
  res.json(reminders);
};

exports.addReminder = async (req, res) => {
  const { title, deadline } = req.body;
  const reminder = new Reminder({ user: req.user.id, title, deadline });
  await reminder.save();
  res.json(reminder);
};

exports.toggleComplete = async (req, res) => {
  const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
  if (!reminder) return res.status(404).json({ msg: 'Not found' });
  reminder.completed = !reminder.completed;
  await reminder.save();
  res.json(reminder);
};
