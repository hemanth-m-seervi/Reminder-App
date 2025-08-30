const Exam = require('../models/Exam');

exports.getExams = async (req, res) => {
  const exams = await Exam.find({ user: req.user.id });
  res.json(exams);
};

exports.addExam = async (req, res) => {
  const { name } = req.body;
  const exam = new Exam({ user: req.user.id, name, details: [] });
  await exam.save();
  res.json(exam);
};

exports.addExamDetail = async (req, res) => {
  const { examId } = req.params;
  const { subject, date, day, time } = req.body;
  const exam = await Exam.findOne({ _id: examId, user: req.user.id });
  if (!exam) return res.status(404).json({ msg: 'Exam not found' });
  exam.details.push({ subject, date, day, time });
  await exam.save();
  res.json({ details: exam.details });
};
