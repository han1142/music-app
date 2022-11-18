const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.controller");
const verifyToken = require("../middleware/auth.middleware");
const authAdmin = require("../middleware/authAdmin.middleware");

router.get("/:id", verifyToken, userCtrl.getUserInfo);
router.post("/update", verifyToken, userCtrl.updateUser);
router.post("/delete", verifyToken, userCtrl.deleteUser);
router.post("/forgot-password", userCtrl.forgotPassword);
router.post("/reset-password", verifyToken, userCtrl.resetPassword);

// Social Login
router.post("/google-login", userCtrl.googleLogin);

// admin routes
router.get("/admin/users", verifyToken, authAdmin, userCtrl.getAllUsers);
router.post(
  "/admin/create-admin",
  verifyToken,
  authAdmin,
  userCtrl.createAdmin
);

module.exports = router;
