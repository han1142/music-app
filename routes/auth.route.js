const express = require('express');
const router = express.Router();
const authCtrl = require('../controller/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.post('/logout', verifyToken, authCtrl.logout);

module.exports = router;
