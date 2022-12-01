const _ = require('lodash');
const bcrypt = require('bcrypt');

const User = require('../models/user.model');
const Sound = require('../models/sound.model');
const generateTokens = require('../utils/createToken');
const sendMail = require('./sendMail.controller');

const { google } = require('googleapis');
const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.CLIENT_ID);

const userCtrl = {
  getUserInfo: async (req, res) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(404).json({ success: false, message: 'Missing ID' });
      }

      const user = await User.findOne({ _id: userId });

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: 'Not found User' });

      return res.json({ success: true, message: 'Get user success', user });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Interal server error' });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { username, fullName, dateOfBirth, gender, maritalStatus, avatar } =
        req.body;

      const existingUser = await User.findOne({ _id: req.userId });

      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          username,
          fullName,
          dateOfBirth,
          gender,
          maritalStatus,
          avatar,
        },
        {
          new: true,
        }
      );

      return res.json({
        success: true,
        message: 'Updated successfully',
        userInfo: updatedUser,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: 'Missing userId' });
    }

    const user = await User.findOneAndDelete({ _id: userId });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: 'Delete user failed' });
    }

    return res.json({ success: true, message: 'Delete user successfully' });
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const { accessToken } = generateTokens(user);
      const url = `${process.env.CLIENT_URL}/reset?token=${accessToken}`;

      const data = await sendMail(
        email,
        'Reset password',
        url,
        'Reset your password'
      );

      return res.json({
        success: true,
        message: 'Please check email to reset password!',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;

      const passwordHash = await bcrypt.hash(password, 12);

      await User.findOneAndUpdate(
        { _id: req.userId },
        {
          password: passwordHash,
        }
      );

      return res.json({
        success: true,
        message: 'Reset password successfully!',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  googleLogin: async (req, res) => {
    const { tokenId } = req.body;

    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID_FOR_LOGIN,
    });

    const { email_verified, email, name, picture } = verify.payload;

    const password = email + process.env.GOOGLE_SECRET;

    const passwordHash = await bcrypt.hash(password, 12);

    if (!email_verified)
      return res
        .status(400)
        .json({ success: false, message: 'Verify email with google failed!' });

    const user = await User.findOne({ email });

    if (user) {
      const { accessToken } = generateTokens(user);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          message: '[LOGIN GOOGLE] Password not match!',
        });

      return res.json({
        success: true,
        message: 'Login google successfully!',
        accessToken,
        userInfo: user,
      });
    } else {
      const newUser = new User({
        username: name,
        fullName: name,
        email,
        password: passwordHash,
      });

      const { accessToken } = generateTokens(newUser);
      await newUser.save();

      return res.json({
        success: true,
        message: 'Login google successfully!',
        accessToken,
        userInfo: newUser,
      });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const { username, perPage = 10, page = 0 } = req.body;

      const query = username
        ? { username: { $regex: username, $options: 'i' }, role: 0 }
        : { role: 0 };

      const users = await User.find(query)
        .limit(perPage)
        .skip(page * perPage);

      return res.json({
        success: true,
        message: 'Get all user successfully!',
        users,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  addToFavorite: async (req, res) => {
    try {
      const { soundId } = req.body;
      const userId = req.userId;

      if (!soundId) {
        return res
          .status(400)
          .json({ success: false, message: 'Sound ID is empty!' });
      }

      const sound = await Sound.findOne({ _id: soundId });

      if (!sound) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found sound with Id' });
      }

      const existingUser = await User.findOne({ _id: userId });
      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $push: { favorites: sound._id },
        },
        { new: true }
      );

      if (!updateUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user' });
      }

      return res.json({
        success: true,
        message: 'Add to favorite successfully!',
        userInfo: updateUser,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  removeFromFavorite: async (req, res) => {
    try {
      const { soundId } = req.body;
      const userId = req.userId;

      if (!soundId) {
        return res
          .status(400)
          .json({ success: false, message: 'Sound ID is empty!' });
      }

      const sound = await Sound.findOne({ _id: soundId });

      if (!sound) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found sound with Id' });
      }

      const existingUser = await User.findOne({ _id: userId });
      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const updateUser = await User.findOneAndUpdate(
        { _id: userId },
        {
          $pull: { favorites: sound._id },
        },
        { new: true }
      );

      if (!updateUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user' });
      }

      return res.json({
        success: true,
        message: 'Remove from favorite successfully!',
        userInfo: updateUser,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  getListFavorite: async (req, res) => {
    try {
      const { name, perPage = 10, page = 0 } = req.body;
      const userId = req.userId;

      const query = name
        ? { name: { $regex: name, $options: 'i' }, role: 0 }
        : { role: 0 };

      const existingUser = await User.findOne({ _id: userId });
      if (!existingUser) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found user!' });
      }

      const listFavorite = existingUser.favorites;

      const soundsInFavorite = await Sound.find({ _id: { $in: listFavorite } })
        .limit(perPage)
        .skip(perPage * page);

      return res.json({
        success: true,
        message: 'Get list favorite successfully!',
        favorites: soundsInFavorite,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.userId;
      const user = await User.findById(userId);
      if (!user)
        return res
          .status(400)
          .json({ success: false, message: 'Not found user!' });

      // compare password
      const passwordValid = await bcrypt.compare(oldPassword, user.password);
      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: 'Password incorrect!' });

      const hashedPassword = await bcrypt.hash(newPassword, 12);
      const updatedCondition = { _id: userId };

      const updatedUser = await User.findOneAndUpdate(
        updatedCondition,
        { password: hashedPassword },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Change password successfully!',
        userInfo: updatedUser,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  createAdmin: async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    //simple validation
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: 'Missing email or password' });

    try {
      const user = await User.findOne({ email: email });

      if (user)
        return res
          .status(400)
          .json({ success: false, message: 'Email already taken' });

      if (password !== confirmPassword)
        return res
          .status(400)
          .json({ success: false, message: 'Password does not match' });

      // all good
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });

      let userInfo = await newUser.save();

      userInfo = _.pick(userInfo, ['_id', 'username', 'email']);

      return res.json({
        success: true,
        message: 'admin created successfully!',
        userInfo,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },
};

module.exports = userCtrl;
