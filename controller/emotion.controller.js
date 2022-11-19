const { trim } = require('lodash');
const Emotion = require('../models/emotion.model')

const emotionCtrl = {
    getEmotions: async (req, res) => {
        try {
            const emotions = await Emotion.find();

            return res.json({
                success: true, 
                message: "Get emotions successfully!",
                emotions
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },
    createEmotion: async (req, res) => {
        try {
            const {name, icon} = req.body

            const newEmotion = new Emotion({
                name, icon: icon
            })

            await newEmotion.save()

            return res.json({
                success: true, 
                message: "Create emotion successfully!",
                emotionInfo: newEmotion
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },
    updateEmotion: async (req, res) => {
        try {
            const {emotionId, name, icon} = req.body

            const updateEmotion = await Emotion.findOneAndUpdate({_id: emotionId}, {
                name, icon
            }, {
                new: true
            })

            if(!updateEmotion) {
                return res.status(404).json({success: false, message: "Not found emotion!"})
            }

            return res.json({
                success: true,
                message: "Update emotion successfully!",
                emotionInfo: updateEmotion
            })
        } catch (error) {
            console.log(error)
            return res.status(500).json({ success: false, message: "Internal server error!"})
        }
    },
    deleteEmotion: async (req, res) => {
        const {emotionId} = req.body

        if(!emotionId) {
            return res.status(400).json({success: false, message: "Missing emotion Id"})
        }

        const deleteEmotion = await Emotion.findOneAndDelete({_id: emotionId})

        if(!deleteEmotion) {
            return res.status(404).json({success: false, message: "Not found emotion!"})
        }

        return res.json({success: true, message: "Delete emotion successfully!"})
    }
}

module.exports = emotionCtrl