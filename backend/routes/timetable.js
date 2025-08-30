const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getTimetable, addTimetable } = require('../controllers/timetableController');

router.get('/', auth, getTimetable);
router.post('/', auth, addTimetable);

module.exports = router;
