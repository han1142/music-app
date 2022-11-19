const User = require("../models/user.model");

const authAdmin = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.userId });

    if (user.role !== 1)
      return res
        .status(400)
        .json({ success: false, message: "Admin resources access denied." });

    next();
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error!" });
  }
};

module.exports = authAdmin;
