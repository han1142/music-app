const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/user.controller");
const verifyToken = require("../middleware/auth.middleware");
const authAdmin = require("../middleware/authAdmin.middleware");

router.get("/:id", verifyToken, userCtrl.getUserInfo);
router.post("/update", verifyToken, userCtrl.updateUser);
router.post("/delete", verifyToken, userCtrl.deleteUser);
router.post("/change-password", verifyToken, userCtrl.changePassword);
router.post("/forgot-password", userCtrl.forgotPassword);
router.post("/reset-password", verifyToken, userCtrl.resetPassword);

router.post('/add-favorite', verifyToken, userCtrl.addToFavorite)
router.post('/remove-favorite', verifyToken, userCtrl.removeFromFavorite)
router.post('/get-favorite', verifyToken, userCtrl.getListFavorite)

// Social Login
router.post("/google-login", userCtrl.googleLogin);

// admin routes
router.post("/admin/users", verifyToken, authAdmin, userCtrl.getAllUsers);
router.post(
  "/admin/create-admin",
  verifyToken,
  authAdmin,
  userCtrl.createAdmin
);

module.exports = router;
