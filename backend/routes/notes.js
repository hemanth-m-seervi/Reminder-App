const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotes, addNote, addNotePdf, createClassOrSem, addSubjectSession, addNoteToSubject, addPdfToSubject, deleteNoteFromSubject } = require('../controllers/notesController');
// Delete note or PDF from subject session
router.delete('/note', auth, deleteNoteFromSubject);
const upload = require('../utils/multer');


// Get all notes
router.get('/', auth, getNotes);

// Create class/sem
router.post('/class', auth, createClassOrSem);

// Add subject session to class/sem
router.post('/subject', auth, addSubjectSession);

// Add note to subject session
router.post('/note', auth, addNoteToSubject);

// Add PDF to subject session
router.post('/pdf', auth, upload.single('pdf'), addPdfToSubject);

module.exports = router;
