const express = require('express');
const router = express.Router();
const authCtrl = require('../controller/auth.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/login', authCtrl.login);
router.post('/register', authCtrl.register);
router.post('/logout', verifyToken, authCtrl.logout);

router.get('/hello', (req, res) => {
    res.json("hello world!")
})

module.exports = router;
