const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmotionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    icon: {
      type: String,
      default: '',
    },
    level: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('emotions', EmotionSchema);
