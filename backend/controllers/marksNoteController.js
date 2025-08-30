// Add subject to existing exam note
exports.addSubjectToExamNote = async (req, res) => {
  const { examName } = req.params;
  const { subject, totalMarks, marks } = req.body;
  let note = await MarksNote.findOne({ user: req.user.id, examName });
  if (!note) return res.status(404).json({ msg: 'Exam note not found' });
  // Avoid duplicate subject
  if (note.subjects.some(s => s.subject === subject)) {
    return res.status(400).json({ msg: 'Subject already exists' });
  }
  note.subjects.push({ subject, totalMarks, marks });
  await note.save();
  res.json(note);
};

// Edit subject in exam note
exports.editSubjectInExamNote = async (req, res) => {
  const { examName, subject } = req.params;
  const { totalMarks, marks } = req.body;
  let note = await MarksNote.findOne({ user: req.user.id, examName });
  if (!note) return res.status(404).json({ msg: 'Exam note not found' });
  const subj = note.subjects.find(s => s.subject === subject);
  if (!subj) return res.status(404).json({ msg: 'Subject not found' });
  subj.totalMarks = totalMarks;
  subj.marks = marks;
  await note.save();
  res.json(note);
};

// Delete subject from exam note
exports.deleteSubjectFromExamNote = async (req, res) => {
  const { examName, subject } = req.params;
  let note = await MarksNote.findOne({ user: req.user.id, examName });
  if (!note) return res.status(404).json({ msg: 'Exam note not found' });
  note.subjects = note.subjects.filter(s => s.subject !== subject);
  await note.save();
  res.json(note);
};
const MarksNote = require('../models/MarksNote');

exports.getMarksNotes = async (req, res) => {
  const notes = await MarksNote.find({ user: req.user.id });
  res.json(notes);
};

exports.addMarksNote = async (req, res) => {
  const { examName, subjects } = req.body;
  let note = await MarksNote.findOne({ user: req.user.id, examName });
  if (note) {
    // Merge subjects, avoid duplicates
    const existingSubjects = note.subjects.map(s => s.subject);
    const newSubjects = subjects.filter(s => !existingSubjects.includes(s.subject));
    note.subjects = [...note.subjects, ...newSubjects];
    await note.save();
  } else {
    note = new MarksNote({ user: req.user.id, examName, subjects });
    await note.save();
  }
  res.json(note);
};
