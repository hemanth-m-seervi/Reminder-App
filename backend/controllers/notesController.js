// Delete a note or PDF from a subject session
exports.deleteNoteFromSubject = async (req, res) => {
  try {
    const { noteId, subject, noteObjIdx } = req.body;
    const noteDoc = await Note.findOne({ _id: noteId, user: req.user.id });
    if (!noteDoc) return res.status(404).json({ msg: 'Class/Sem not found' });
    const subjectSession = noteDoc.subjects.find(s => s.subject === subject);
    if (!subjectSession) return res.status(404).json({ msg: 'Subject not found' });
    if (typeof noteObjIdx !== 'number' || noteObjIdx < 0 || noteObjIdx >= subjectSession.notes.length) {
      return res.status(400).json({ msg: 'Invalid note index' });
    }
    subjectSession.notes.splice(noteObjIdx, 1);
    await noteDoc.save();
    res.json(noteDoc);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};
const Note = require('../models/Note');
const cloudinary = require('../utils/cloudinary');


// Get all notes for user
exports.getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
};

// Create a new class/sem
exports.createClassOrSem = async (req, res) => {
  try {
    const { classOrSem } = req.body;
    if (!classOrSem) return res.status(400).json({ msg: 'Class/Sem is required' });
    const newNote = new Note({ user: req.user.id, classOrSem, subjects: [] });
    await newNote.save();
    res.status(201).json(newNote);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Add a subject session to a class/sem
exports.addSubjectSession = async (req, res) => {
  try {
    const { noteId, subject } = req.body;
    if (!noteId || !subject) return res.status(400).json({ msg: 'noteId and subject are required' });
    const noteDoc = await Note.findOne({ _id: noteId, user: req.user.id });
    if (!noteDoc) return res.status(404).json({ msg: 'Class/Sem not found' });
    // Prevent duplicate subjects
    if (noteDoc.subjects.some(s => s.subject === subject)) {
      return res.status(400).json({ msg: 'Subject already exists' });
    }
    noteDoc.subjects.push({ subject, notes: [] });
    await noteDoc.save();
    res.status(201).json(noteDoc);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};

// Add a note or PDF to a subject session
exports.addNoteToSubject = async (req, res) => {
  const { noteId, subject, note } = req.body;
  const noteDoc = await Note.findOne({ _id: noteId, user: req.user.id });
  if (!noteDoc) return res.status(404).json({ msg: 'Class/Sem not found' });
  const subjectSession = noteDoc.subjects.find(s => s.subject === subject);
  if (!subjectSession) return res.status(404).json({ msg: 'Subject not found' });
  subjectSession.notes.push({ note });
  await noteDoc.save();
  res.json(noteDoc);
};

// Add a PDF to a subject session
exports.addPdfToSubject = async (req, res) => {
  try {
    const { noteId, subject, note } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'No PDF uploaded' });
    const noteDoc = await Note.findOne({ _id: noteId, user: req.user.id });
    if (!noteDoc) return res.status(404).json({ msg: 'Class/Sem not found' });
    const subjectSession = noteDoc.subjects.find(s => s.subject === subject);
    if (!subjectSession) return res.status(404).json({ msg: 'Subject not found' });
    cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'notes_pdfs' },
      async (error, uploadResult) => {
        if (error) return res.status(500).json({ msg: 'Cloudinary upload error' });
        subjectSession.notes.push({ note, pdfUrl: uploadResult.secure_url });
        await noteDoc.save();
        res.json(noteDoc);
      }
    ).end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
