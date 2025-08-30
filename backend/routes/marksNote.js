const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getMarksNotes, addMarksNote, addSubjectToExamNote, editSubjectInExamNote, deleteSubjectFromExamNote } = require('../controllers/marksNoteController');


router.get('/', auth, getMarksNotes);
router.post('/', auth, addMarksNote);
router.post('/:examName/subject', auth, addSubjectToExamNote);
router.put('/:examName/subject/:subject', auth, editSubjectInExamNote);
router.delete('/:examName/subject/:subject', auth, deleteSubjectFromExamNote);

module.exports = router;
