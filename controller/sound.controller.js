const Sound = require('../models/sound.model');
const Emotion = require('../models/emotion.model');

const soundCtrl = {
  getSounds: async (req, res) => {
    try {
      const { name } = req.body;

      const query = name
        ? { name: { $regex: name, $options: 'i' }, type: 'SOUND' }
        : { type: 'SOUND' };

      const sounds = await Sound.find(query);

      return res.json({
        success: true,
        message: 'Get sounds successfully!',
        sounds,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  getMusicAdmin: async (req, res) => {
    try {
      const { name } = req.body;

      const query = name
        ? { name: { $regex: name, $options: 'i' }, type: 'MUSIC' }
        : { type: 'MUSIC' };

      const musics = await Sound.find(query);

      return res.json({
        success: true,
        message: 'Get musics successfully!',
        musics,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  getMusics: async (req, res) => {
    try {
      const { name, emotionIds = [] } = req.body;

      const query = name
        ? {
            name: { $regex: name, $options: 'i' },
            type: 'MUSIC',
            // $or: [ { emotion: { $in: emotionIds }}],
          }
        : { emotion: { $in: emotionIds }, type: 'MUSIC'};

      const musics = await Sound.find(query);

      return res.json({
        success: true,
        message: 'Get musics successfully!',
        musics,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  createSound: async (req, res) => {
    try {
      const {
        name,
        description,
        file,
        image,
        duration,
        type,
        emotion,
        artist,
      } = req.body;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: 'Please add file!' });
      }

      const existingEmotion = await Emotion.findOne({ _id: emotion });

      if (!existingEmotion) {
        return res
          .status(404)
          .json({ success: false, message: 'Emotion not found!' });
      }

      const newSound = new Sound({
        name,
        description,
        file,
        image,
        duration,
        type,
        emotion,
        artist,
      });

      await newSound.save();

      res.json({
        success: true,
        message: 'Create new sound successfully!',
        soundInfo: newSound,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },
  updateSound: async (req, res) => {
    try {
      const {
        soundId,
        name,
        description,
        file,
        image,
        duration,
        type,
        emotion,
        artist,
      } = req.body;

      if (!file) {
        return res
          .status(400)
          .json({ success: false, message: 'Please add file!' });
      }

      const existingEmotion = await Emotion.findOne({ _id: emotion });

      if (!existingEmotion) {
        return res
          .status(404)
          .json({ success: false, message: 'Emotion not found!' });
      }

      const updateSound = await Sound.findOneAndUpdate(
        { _id: soundId },
        {
          name,
          description,
          file,
          image,
          duration,
          type,
          emotion,
          artist,
        },
        {
          new: true,
        }
      );

      if (!updateSound) {
        return res
          .status(404)
          .json({ success: false, message: 'Sound not found!' });
      }

      res.json({
        success: true,
        message: 'Update sound successfully!',
        soundInfo: updateSound,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },
  deleteSound: async (req, res) => {
    try {
      const { soundId } = req.body;

      if (!soundId) {
        return res
          .status(400)
          .json({ success: false, message: 'Missing sound Id' });
      }

      const deleteSound = await Sound.findByIdAndDelete({ _id: soundId });

      if (!deleteSound) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found sound!' });
      }

      return res.json({ success: true, message: 'Delete sound successfully!' });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },
};

module.exports = soundCtrl;
