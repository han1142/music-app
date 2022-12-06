const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/auth.middleware');
const authAdmin = require('../middleware/authAdmin.middleware')
const soundCtrl = require('../controller/sound.controller')

router.post('/sounds', soundCtrl.getSounds)
router.post('/musics', soundCtrl.getMusics)
router.post('/musics-admin', soundCtrl.getMusicAdmin)
router.post('/create', soundCtrl.createSound);
router.post('/update', soundCtrl.updateSound);
router.post('/delete', soundCtrl.deleteSound);

module.exports = router;
