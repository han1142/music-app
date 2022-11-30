const Playlist = require('../models/playlist.model');
const User = require('../models/user.model');
const Sound = require('../models/sound.model');

const playlistCtrl = {
  createPlaylist: async (req, res) => {
    try {
      const { name, description, songs = [] } = req.body;

      const existingUser = await User.find({ _id: req.userId });

      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const existingPlaylist = await Playlist.find({
        name,
        userId: req.userId,
      });

      if (existingPlaylist && existingPlaylist.length !== 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Playlist existed! Name existed!' });
      }

      // if (!songs || songs.length || songs.length === 0) {
      //   return res
      //     .status(400)
      //     .json({ success: false, message: "Songs must be not empty!" });
      // }

      const newPlaylist = new Playlist({
        name,
        description,
        userId: req.userId,
        songs,
      });

      await newPlaylist.save();

      return res.json({
        success: true,
        message: 'Create playlist successfully!',
        playlistInfo: newPlaylist,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  addSong: async (req, res) => {
    try {
      const { soundId, playlistId } = req.body;
      const userId = req.userId;

      const existingUser = await User.find({ _id: userId });

      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const existingPlaylist = await Playlist.findOne({
        _id: playlistId,
        userId: userId,
      });

      if (!existingPlaylist) {
        return res
          .status(404)
          .json({ success: false, message: 'Playlist not found!' });
      }

      const existingSound = await Sound.findOne({ _id: soundId });

      if (!existingSound) {
        return res
          .status(404)
          .json({ success: false, message: 'Song not found!' });
      }
      let listSongId = existingPlaylist.songs;

      if (listSongId.includes(soundId)) {
        return res
          .status(400)
          .json({ success: false, message: 'This song existed in playlist' });
      }

      const updatePlaylist = await Playlist.findOneAndUpdate(
        {
          _id: playlistId,
          userId: userId,
        },
        {
          $push: { songs: soundId },
        },
        {
          new: true,
        }
      );

      if (!updatePlaylist) {
        return res
          .status(400)
          .json({ success: false, message: 'Update failed!' });
      }

      listSongId = updatePlaylist.songs;

      const listSong = await Sound.find({
        _id: { $in: listSongId },
      });

      return res.json({
        success: true,
        message: 'Add song to playlist successfully!',
        playlist: updatePlaylist,
        songs: listSong,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  removeSong: async (req, res) => {
    try {
      const { soundId, playlistId } = req.body;
      const userId = req.userId;

      const existingUser = await User.find({ _id: userId });

      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const existingPlaylist = await Playlist.findOne({
        _id: playlistId,
        userId: userId,
      });

      if (!existingPlaylist) {
        return res
          .status(404)
          .json({ success: false, message: 'Playlist not found!' });
      }

      const existingSound = await Sound.findOne({ _id: soundId });

      if (!existingSound) {
        return res
          .status(404)
          .json({ success: false, message: 'Song not found!' });
      }
      let listSongId = existingPlaylist.songs;

      if (!listSongId.includes(soundId)) {
        return res
          .status(400)
          .json({ success: false, message: 'Not found this song in playlist' });
      }

      const updatePlaylist = await Playlist.findOneAndUpdate(
        {
          _id: playlistId,
          userId: userId,
        },
        {
          $pull: { songs: soundId },
        },
        {
          new: true,
        }
      );

      if (!updatePlaylist) {
        return res
          .status(400)
          .json({ success: false, message: 'Update failed!' });
      }

      listSongId = updatePlaylist.songs;

      const listSong = await Sound.find({
        _id: { $in: listSongId },
      });

      return res.json({
        success: true,
        message: 'Remove song from playlist successfully!',
        playlist: updatePlaylist,
        songs: listSong,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  updatePlaylist: async (req, res) => {
    try {
      const { playlistId, name, description } = req.body;

      const existingUser = await User.find({ _id: req.userId });
      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const existingPlaylist = await Playlist.findOne({ _id: playlistId });
      if (!existingPlaylist) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found playlist!' });
      }

      const existingPlaylistName = await Playlist.find({
        _id: { $not: playlistId },
        name,
        userId: req.userId,
      });

      if (existingPlaylistName) {
        return res.status(400).json({ success: false, message: '' });
      }
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  getPlaylists: async (req, res) => {
    try {
      const playlists = await Playlist.find({ userId: req.userId });

      return res.json({
        success: true,
        message: 'Get playlist successfully!',
        playlists,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  getPlaylistDetail: async (req, res) => {
    try {
      const { playlistId } = req.body;
      const playlist = await Playlist.findOne({
        _id: playlistId,
        userId: req.userId,
      }).populate({ path: 'songs' });

      if (!playlist) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found playlist!' });
      }

      return res.json({
        success: true,
        message: 'Get playlist detail successfully!',
        playlist,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },

  deletePlaylist: async (req, res) => {
    try {
      const { playlistId } = req.body;

      const existingPlaylist = await Playlist.findOne({ _id: playlistId });
      if (!existingPlaylist) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found playlist!' });
      }

      const deletePlaylist = await Playlist.findOneAndDelete({ _id: playlistId })

      return res.json({ success: true, message: "Delete playlist successfully!", deletePlaylist })
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error' });
    }
  },
};

module.exports = playlistCtrl;
