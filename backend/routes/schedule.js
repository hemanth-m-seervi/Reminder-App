const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getSchedule, addSchedule } = require('../controllers/scheduleController');

router.get('/', auth, getSchedule);
router.post('/', auth, addSchedule);

module.exports = router;
