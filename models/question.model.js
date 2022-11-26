const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    emotions: {
        type: [mongoose.Types.ObjectId],
        ref: "emotions",
        default: []
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("questions", QuestionSchema);
