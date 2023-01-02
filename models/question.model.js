const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    emotions: {
      type: [mongoose.Types.ObjectId],
      ref: 'emotions',
      default: [],
    },
    answerParent: {
      type: mongoose.Types.ObjectId,
      ref: 'emotions',
      default: null,
    },
    parent: {
      type: mongoose.Types.ObjectId,
      ref: 'questions',
      default: null,
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

module.exports = mongoose.model('questions', QuestionSchema);
