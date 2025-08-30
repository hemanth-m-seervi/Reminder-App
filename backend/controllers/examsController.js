const Exam = require('../models/Exam');

exports.getExams = async (req, res) => {
  const exams = await Exam.find({ user: req.user.id });
  res.json(exams);
};

exports.addExam = async (req, res) => {
  const { subject, date, marks } = req.body;
  const exam = new Exam({ user: req.user.id, subject, date, marks });
  await exam.save();
  res.json(exam);
};
