const express = require('express');
const router = express.Router();
const questionCtrl = require('../controller/question.controller')
const verifyToken = require('../middleware/auth.middleware');

router.post('/', questionCtrl.getQuestions);
router.post('/create', questionCtrl.createQuestion);
router.post('/update', questionCtrl.updateQuestion);
router.post('/delete', questionCtrl.deleteQuestion);

module.exports = router;
