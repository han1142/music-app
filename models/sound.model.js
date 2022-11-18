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
    fileUrl: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["SOUND", "MUSIC"],
      required: true,
      default: "SOUND",
    },
    emotions: {
      type: [mongoose.Types.ObjectId],
      ref: "emotions",
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("sounds", SoundSchema);
