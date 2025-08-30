const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getNotes, addNote, addNotePdf } = require('../controllers/notesController');
const upload = require('../utils/multer');

router.get('/', auth, getNotes);
router.post('/', auth, addNote);
router.post('/pdf', auth, upload.single('pdf'), addNotePdf);

module.exports = router;
