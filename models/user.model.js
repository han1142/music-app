const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    favorites: {
      type: [mongoose.Types.ObjectId],
      ref: "sounds",
      default: [],
    },
    playlists: {
      type: [mongoose.Types.ObjectId],
      ref: "paylists",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", UserSchema);
