const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.controller");
const verifyToken = require("../middleware/auth.middleware");

router.get("/get/:id", verifyToken, userCtrl.getUserInfo);
router.post("/update", verifyToken, userCtrl.updateUser);
router.post("/delete", verifyToken, userCtrl.deleteUser);
router.post("/forgot-password", userCtrl.forgotPassword);
router.post("/reset-password", verifyToken, userCtrl.resetPassword);
module.exports = router;
