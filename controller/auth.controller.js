const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const generateTokens = require('../utils/createToken')

const authCtrl = {
  register: async (req, res) => {
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

      const { accessToken } = generateTokens(newUser)

      let userInfo = await newUser.save();

      userInfo = _.pick(userInfo, ["_id", "username", "email"]);

      res.json({
        success: true,
        message: "user created successfully!",
        userInfo,
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: false, message: "Missing email or password" });

    try {
      // check user existing
      const user = await User.findOne({ email });

      if (!user)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect email" });

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid)
        return res
          .status(400)
          .json({ success: false, message: "Incorrect  password" });

      const { accessToken } = generateTokens(user);

      const userInfo = _.pick(user, [
        "_id",
        "username",
        "email",
        "favorites",
        "playlists",
      ]);

      res.json({
        success: true,
        message: "User logged in successfully",
        userInfo: userInfo,
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: "Interal server error" });
    }
  },

  logout: async (req, res) => {
    if (req.userId) {
      return res.status(200).json("Logged out!");
    } else {
      return res.status(500).json("Internal server error!");
    }
  },
};

module.exports = authCtrl;
