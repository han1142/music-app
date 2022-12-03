const express = require('express');
const router = express.Router();
const questionCtrl = require('../controller/question.controller')
const verifyToken = require('../middleware/auth.middleware');

router.post('/', questionCtrl.getQuestions);
router.post('/random-question', verifyToken, questionCtrl.getRandomQuestion);
router.post('/create', verifyToken, questionCtrl.createQuestion);
router.post('/update', verifyToken, questionCtrl.updateQuestion);
router.post('/delete', verifyToken, questionCtrl.deleteQuestion);

module.exports = router;
