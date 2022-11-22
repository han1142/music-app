const Playlist = require("../models/playlist.model");
const User = require("../models/user.model");

const playlistCtrl = {
  createPlaylist: async (req, res) => {
    try {
      const { name, description, songs } = req.body;

      const existingUser = await User.find({ _id: req.userId });

      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: "Not found user!" });
      }

      const existingPlaylist = await Playlist.find({
        name,
        userId: req.userId,
      });

      if (existingPlaylist) {
        return res
          .status(400)
          .json({ success: false, message: "Playlist existed!" });
      }

      if (!songs || songs.length || songs.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "Songs must be not empty!" });
      }

      const newPlaylist = new Playlist({
        name,
        description,
        songs,
      });

      await newPlaylist.save();

      return res.json({
        success: true,
        message: "Create playlist successfully!",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  addSong: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  removeSong: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  updatePlaylist: async (req, res) => {
    try {
      const { playlistId, name, description } = req.body;

      const existingUser = await User.find({ _id: req.userId });
      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: "Not found user!" });
      }

      const existingPlaylist = await Playlist.findOne({ _id: playlistId });
      if (!existingPlaylist) {
        return res
          .status(404)
          .json({ success: false, message: "Not found user!" });
      }

      const existingPlaylistName = await Playlist.find({
        _id: { $not: playlistId },
        name,
        userId: req.userId,
      });

      if (existingPlaylistName) {
        return res.status(400).json({ success: false, message: "" });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  getPlaylists: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  deletePlaylist: async (req, res) => {
    try {
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
};

module.exports = playlistCtrl;
