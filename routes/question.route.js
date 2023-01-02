const express = require('express');
const router = express.Router();
const questionCtrl = require('../controller/question.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/', questionCtrl.getQuestions);
router.post('/random-question', questionCtrl.getRandomQuestion);
router.post('/question-level-1', questionCtrl.getQuestionLevel1);
router.post('/question-level-2', questionCtrl.getQuestionLevel2);
router.post('/create', questionCtrl.createQuestion);
router.post('/create-level-1', questionCtrl.createQuestionLevel1);
router.post('/create-level-2', questionCtrl.createQuestionLevel2);
router.post('/update', questionCtrl.updateQuestion);
router.post('/delete', questionCtrl.deleteQuestion);

module.exports = router;
