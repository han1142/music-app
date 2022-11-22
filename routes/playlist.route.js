const express = require("express");
const playlistCtrl = require("../controller/playlist.controller");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const authAdmin = require("../middleware/authAdmin.middleware");

router.get("/", playlistCtrl.getPlaylists);
router.post("/create", playlistCtrl.createPlaylist);
router.post("/update", playlistCtrl.updatePlaylist);
router.post("/delete", playlistCtrl.deletePlaylist);

module.exports = router;
