const Note = require('../models/Note');
const cloudinary = require('../utils/cloudinary');

exports.getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id });
  res.json(notes);
};

exports.addNote = async (req, res) => {
  const { subject, note } = req.body;
  const newNote = new Note({ user: req.user.id, subject, note });
  await newNote.save();
  res.json(newNote);
};

exports.addNotePdf = async (req, res) => {
  try {
    const { subject, note } = req.body;
    if (!req.file) return res.status(400).json({ msg: 'No PDF uploaded' });
    const result = await cloudinary.uploader.upload_stream(
      { resource_type: 'raw', folder: 'notes_pdfs' },
      async (error, uploadResult) => {
        if (error) return res.status(500).json({ msg: 'Cloudinary upload error' });
        const newNote = new Note({
          user: req.user.id,
          subject,
          note,
          pdfUrl: uploadResult.secure_url,
        });
        await newNote.save();
        res.json(newNote);
      }
    );
    result.end(req.file.buffer);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
