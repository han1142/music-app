const Question = require('../models/question.model')
const _ = require('lodash')

const QuestionCtrl = {
    getQuestions: async (req, res) => {
        try {
            const { content, perPage = 10, page = 0 } = req.body

            const query = content ? { content: { "$regex": content, "$options": "i" } } : {}
      
            const questions = await Question.find(query).limit(perPage).skip(page * perPage);

            return res.json({
                success: true,
                message: "Get all questions successfully!",
                questions,
              });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },

    getRandomQuestion: async (req, res) => {
        try {
            const questions = await Question.find().populate('emotions');
            if(!questions || questions.length === 0 ) {
                return res.status(400).json({ success: false, message: "Question list is empty!" })
            }

            const randomQuestion = questions[_.random(0, questions.length - 1)]

            return res.json({ success: true, message: "Get question successfully!", question: randomQuestion })

        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },

    createQuestion: async (req, res) => {
        try {
            const { content, emotionIds = [] } = req.body

            if(!content) {
                return rea.status(400).json({success: false, message: "Content is empty!"})
            }

            const newQuestion = new Question({
                content,
                emotions: emotionIds
            })
            await newQuestion.save()

            return res.json({ success: true, message: 'Create question successfully!', questionInfo: newQuestion})
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },

    updateQuestion: async (req, res) => {
        try {
            const { content, emotionIds = [], questionId } = req.body

            if(!content || !questionId) {
                return rea.status(400).json({success: false, message: "Content is empty!"})
            }

            const existingQuestion = await Question.findOne({ _id: questionId })

            if(!existingQuestion) {
                return res.status(404).json({ success: false, message: 'Not found question' })
            }

            const updateQuestion = await Question.findOneAndUpdate({ _id: questionId }, {
                content,
                emotionIds
            }, {
                new: true
            })

            if(!updateQuestion) {
                return res.status(400).json({ success: false, message: "Error update question!"})
            }

            return res.json({ success: true, message: "Update question successfully!", questionInfo: updateQuestion })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },

    deleteQuestion: async (req, res) => {
        try {
            const { questionId } = req.body

            const existingQuestion = await Question.findOne({ _id: questionId })

            if(!existingQuestion) {
                return res.status(404).json({ success: false, message: 'Not found question' })
            }
            await Question.findOneAndDelete({ _id: questionId })

            return res.json({ success: true, message: "Delete question successfully!" })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },
    
}

module.exports = QuestionCtrl