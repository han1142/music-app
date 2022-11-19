const express = require('express');
const { auth } = require('google-auth-library');
const router = express.Router();

const emotionCtrl = require('../controller/emotion.controller')
const verifyToken = require('../middleware/auth.middleware')
const authAdmin = require('../middleware/authAdmin.middleware')

router.get('/', emotionCtrl.getEmotions);
router.post('/create', emotionCtrl.createEmotion)
router.post('/update', emotionCtrl.updateEmotion)
router.post('/delete', emotionCtrl.deleteEmotion)

module.exports = router