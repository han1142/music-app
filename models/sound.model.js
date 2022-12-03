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
    type: {
      type: String,
      enum: ["SOUND", "MUSIC"],
      required: true,
      default: "SOUND",
    },
    emotion: {
      type: mongoose.Types.ObjectId,
      ref: "emotions",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("sounds", SoundSchema);
