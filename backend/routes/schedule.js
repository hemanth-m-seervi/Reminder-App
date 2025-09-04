const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSchedule, addSchedule, deleteSchedule } = require('../controllers/scheduleController');

router.get('/', auth, getSchedule);
router.post('/', auth, addSchedule);
router.delete('/:id', auth, deleteSchedule);

module.exports = router;
