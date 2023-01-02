const express = require('express');
const { auth } = require('google-auth-library');
const router = express.Router();

const emotionCtrl = require('../controller/emotion.controller');
const verifyToken = require('../middleware/auth.middleware');
const authAdmin = require('../middleware/authAdmin.middleware');

router.post('/', emotionCtrl.getEmotions);
router.post('/create', emotionCtrl.createEmotion);
router.post('/create-level-1', emotionCtrl.createEmotionLevel1);
router.post('/create-level-2', emotionCtrl.createEmotionLevel2);
router.post('/update', emotionCtrl.updateEmotion);
router.post('/delete', emotionCtrl.deleteEmotion);

module.exports = router;
