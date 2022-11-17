const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaylistSchema = new Schema(
  {},
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("playlists", PaylistSchema);
