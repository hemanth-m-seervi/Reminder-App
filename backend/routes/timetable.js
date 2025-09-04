const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTimetable, addTimetable, deleteTimetable } = require('../controllers/timetableController');


router.get('/', auth, getTimetable);
router.post('/', auth, addTimetable);
router.delete('/:id', auth, deleteTimetable);

module.exports = router;
