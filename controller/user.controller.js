const _ = require("lodash");
const bcrypt = require("bcrypt");

const User = require("../models/user.model");
const generateTokens = require("../utils/createToken");
const sendMail = require("./sendMail.controller");

const { google } = require("googleapis");
const { OAuth2 } = google.auth;

const client = new OAuth2(process.env.CLIENT_ID);

const userCtrl = {
  getUserInfo: async (req, res) => {
    try {
      const userId = req.params.id;

      if (!userId) {
        return res.status(404).json({ success: false, message: "Missing ID" });
      }

      const user = await User.findOne({ _id: userId });

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Not found User" });

      return res.json({ success: true, message: "Get user success", user });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Interal server error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { username } = req.body;
      if (!username) return res.status(400).json({ msg: "Missing username" });

      const updatedUser = await User.findOneAndUpdate(
        { _id: req.userId },
        {
          username,
        },
        {
          new: true,
        }
      );

      const userInfo = _.pick(updatedUser, ["_id", "username", "email"]);

      return res.json({
        success: true,
        message: "Updated successfully",
        userInfo,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },

  deleteUser: async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "Missing userId" });
    }

    const user = await User.findByIdAndDelete({ _id: userId });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Delete user failed" });
    }

    return res.json({ success: true, message: "Delete user successfully" });
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email });

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "Not found user!" });
      }

      const { accessToken } = generateTokens(user);
      const url = `${process.env.CLIENT_URL}/user/reset/${accessToken}`;

      const data = await sendMail(
        email,
        "Reset password",
        url,
        "Reset your password"
      );

      return res.json({
        success: true,
        message: "Please check email to reset password!",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
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
        message: "Reset password successfully!",
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },

  googleLogin: async (req, res) => {
    const { tokenId } = req.body;

    const verify = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.CLIENT_ID,
    });

    const { email_verified, email, name, picture } = verify.payload;

    const password = email + process.env.GOOGLE_SECRET;

    const passwordHash = await bcrypt.hash(password, 12);

    if (!email_verified)
      return res
        .status(400)
        .json({ success: false, message: "Verify email with google failed!" });

    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({
          success: false,
          message: "[LOGIN GOOGLE] Password not match!",
        });

      return res.json({ success: true, message: "Login google successfully!" });
    } else {
      const newUser = new User({
        name,
        email,
        password: passwordHash,
        avatar: picture,
      });

      await newUser.save();

      return res.json({ success: true, message: "Login google successfully!" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      console.log("get all users");
      const users = await User.find();

      return {
        success: true,
        message: "Get all user successfully!",
        users,
      };
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },

  createAdmin: async (req, res) => {
    const { email, username, password, confirmPassword } = req.body;

    //simple validation
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });

    try {
      const user = await User.findOne({ email: email });

      if (user)
        return res
          .status(400)
          .json({ success: false, message: "Email already taken" });

      if (password !== confirmPassword)
        return res
          .status(400)
          .json({ success: false, message: "Password does not match" });

      // all good
      const hashedPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });

      let userInfo = await newUser.save();

      userInfo = _.pick(userInfo, ["_id", "username", "email"]);

      return res.json({
        success: true,
        message: "admin created successfully!",
        userInfo,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error!" });
    }
  },
};

module.exports = userCtrl;
