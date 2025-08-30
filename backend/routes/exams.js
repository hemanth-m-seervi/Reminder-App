const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getExams, addExam } = require('../controllers/examsController');

router.get('/', auth, getExams);
router.post('/', auth, addExam);

module.exports = router;
