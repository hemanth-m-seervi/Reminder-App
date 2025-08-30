const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getReminders, addReminder, toggleComplete } = require('../controllers/remindersController');

router.get('/', auth, getReminders);
router.post('/', auth, addReminder);
router.patch('/:id', auth, toggleComplete);

module.exports = router;
