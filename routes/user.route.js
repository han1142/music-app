const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.controller");
const verifyToken = require("../middleware/auth.middleware");
const authAdmin = require("../middleware/authAdmin.middleware");

router.get("/:id", userCtrl.getUserInfo);
router.post("/update", userCtrl.updateUser);
router.post("/delete", userCtrl.deleteUser);
router.post("/forgot-password", userCtrl.forgotPassword);
router.post("/reset-password", userCtrl.resetPassword);

router.post('/add-favorite', verifyToken, userCtrl.addToFavorite)
router.post('/remove-favorite', verifyToken, userCtrl.removeFromFavorite)
router.post('/get-favorite', verifyToken, userCtrl.getListFavorite)

// Social Login
router.post("/google-login", userCtrl.googleLogin);

// admin routes
router.post("/admin/users", userCtrl.getAllUsers);
router.post(
  "/admin/create-admin",
  verifyToken,
  authAdmin,
  userCtrl.createAdmin
);

module.exports = router;
