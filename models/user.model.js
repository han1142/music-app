const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: true,
    },

    fullName: {
      type: String,
      default: ""
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: Number,
      default: 0,
    },

    dateOfBirth: {
      type: Date,
      default: Date.now,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: "MALE",
    },

    maritalStatus: {
      type: String,
      enum: ["SINGLE", "IN_LOVE"],
      default: "SINGLE",
    },

    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png",
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
