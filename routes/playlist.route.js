const express = require("express");
const playlistCtrl = require("../controller/playlist.controller");
const router = express.Router();

const verifyToken = require("../middleware/auth.middleware");
const authAdmin = require("../middleware/authAdmin.middleware");

router.get("/", verifyToken, playlistCtrl.getPlaylists);
router.post("/create", verifyToken, playlistCtrl.createPlaylist);
router.post("/detail", verifyToken, playlistCtrl.getPlaylistDetail);
router.post("/add", verifyToken, playlistCtrl.addSong);
router.post("/remove", verifyToken, playlistCtrl.removeSong);
router.post("/update", verifyToken, playlistCtrl.updatePlaylist);
router.post("/delete", verifyToken, playlistCtrl.deletePlaylist);

module.exports = router;
