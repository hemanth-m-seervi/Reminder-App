const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getExams, addExam, addExamDetail } = require('../controllers/examsController');


router.get('/', auth, getExams);
router.post('/', auth, addExam);
router.post('/:examId/details', auth, addExamDetail);

module.exports = router;
