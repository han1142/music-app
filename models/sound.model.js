const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SoundSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    file: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    artist: {
      type: String,
      default: "No artist"
    },
    duration: {
      type: Number,
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      enum: ["SOUND", "MUSIC"],
      required: true,
      default: "SOUND",
    },
    emotion: {
      type: mongoose.Types.ObjectId,
      ref: "emotions",
      default: null
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("sounds", SoundSchema);
