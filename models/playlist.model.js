const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },

    image: {
      type: String,
      trim: true,
      default: ""
    },

    description: {
      type: String,
      default: "",
    },

    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },

    songs: {
      type: [mongoose.Types.ObjectId],
      ref: "sounds",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("playlists", PlaylistSchema);
