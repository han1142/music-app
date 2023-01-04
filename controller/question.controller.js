const Question = require('../models/question.model');
const _ = require('lodash');

const QuestionCtrl = {
  getQuestions: async (req, res) => {
    try {
      const { content } = req.body;

      const query = content
        ? { content: { $regex: content, $options: 'i' } }
        : {};

      const questions = await Question.find(query).populate('emotions');

      return res.json({
        success: true,
        message: 'Get all questions successfully!',
        questions,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  getEmotion: async (req, res) => {
    try {
      const { id } = req.body;

      const question = await Question.findOne({ _id: id }).populate('emotions');

      if (!question) {
        return res.status.json({
          success: false,
          message: 'Not found question',
        });
      }

      return res.json({
        success: true,
        message: 'Get question emotions successfully!',
        question,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  getQuestionLevel1: async (req, res) => {
    try {
      const questions = await Question.find({ level: 1 }).populate('emotions');
      if (!questions || questions.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Question list is empty!' });
      }

      const randomQuestion = questions[_.random(0, questions.length - 1)];

      return res.json({
        success: true,
        message: 'Get question level 1 successfully!',
        question: randomQuestion,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  getQuestionLevel2: async (req, res) => {
    try {
      const { parentId, answerParentId } = req.body;

      const questions = await Question.find({
        level: 2,
        parent: parentId,
        answerParent: answerParentId,
      }).populate('emotions');

      if (!questions || questions.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Question list is empty!' });
      }

      const randomQuestion = questions[_.random(0, questions.length - 1)];

      return res.json({
        success: true,
        message: 'Get question level 2 successfully!',
        question: randomQuestion,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  createQuestionLevel1: async (req, res) => {
    try {
      const { content, emotionIds = [] } = req.body;

      if (!content) {
        return res
          .status(400)
          .json({ success: false, message: 'Content is empty!' });
      }

      const newQuestion = new Question({
        content,
        emotions: emotionIds,
        level: 1,
      });
      await newQuestion.save();

      return res.json({
        success: true,
        message: 'Create question level 1 successfully!',
        questionInfo: newQuestion,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  createQuestionLevel2: async (req, res) => {
    try {
      const { content, emotionIds = [], parentId, answerParentId } = req.body;

      if (!content) {
        return res
          .status(400)
          .json({ success: false, message: 'Content is empty!' });
      }
      if (!parentId) {
        return res
          .status(400)
          .json({ success: false, message: 'Parent id is empty!' });
      }

      const newQuestion = new Question({
        content,
        emotions: emotionIds,
        parent: parentId,
        answerParent: answerParentId,
        level: 2,
      });
      await newQuestion.save();

      return res.json({
        success: true,
        message: 'Create question level 2 successfully!',
        questionInfo: newQuestion,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  getRandomQuestion: async (req, res) => {
    try {
      const questions = await Question.find().populate('emotions');
      if (!questions || questions.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'Question list is empty!' });
      }

      const randomQuestion = questions[_.random(0, questions.length - 1)];

      return res.json({
        success: true,
        message: 'Get question successfully!',
        question: randomQuestion,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  createQuestion: async (req, res) => {
    try {
      const { content, emotionIds = [], level, parent } = req.body;

      if (!content) {
        return rea
          .status(400)
          .json({ success: false, message: 'Content is empty!' });
      }

      if (level !== 1 && !parent) {
        return res
          .status(400)
          .json({ success: false, message: 'Parent id is empty' });
      }

      const newQuestion = new Question({
        content,
        emotions: emotionIds,
        level,
        parent,
      });
      await newQuestion.save();

      return res.json({
        success: true,
        message: 'Create question successfully!',
        questionInfo: newQuestion,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  updateQuestion: async (req, res) => {
    try {
      const { content, emotionIds = [], questionId } = req.body;

      console.log(emotionIds);

      if (!content || !questionId) {
        return rea
          .status(400)
          .json({ success: false, message: 'Content is empty!' });
      }

      const existingQuestion = await Question.findOne({ _id: questionId });
      console.log(existingQuestion);

      if (!existingQuestion) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found question' });
      }

      const updateQuestion = await Question.findOneAndUpdate(
        { _id: questionId },
        {
          $set: {
            content,
            emotions: emotionIds,
          },
        },
        {
          new: true,
        }
      );

      if (!updateQuestion) {
        return res
          .status(400)
          .json({ success: false, message: 'Error update question!' });
      }

      console.log('updateQuestion', updateQuestion);

      return res.json({
        success: true,
        message: 'Update question successfully!',
        questionInfo: updateQuestion,
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },

  deleteQuestion: async (req, res) => {
    try {
      const { questionId } = req.body;

      const existingQuestion = await Question.findOne({ _id: questionId });

      if (!existingQuestion) {
        return res
          .status(404)
          .json({ success: false, message: 'Not found question' });
      }
      await Question.findOneAndDelete({ _id: questionId });

      return res.json({
        success: true,
        message: 'Delete question successfully!',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: 'Internal server error!' });
    }
  },
};

module.exports = QuestionCtrl;
