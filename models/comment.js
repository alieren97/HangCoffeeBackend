const mongoose = require('mongoose')

const commentScheme = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Please enter a comment']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('Comment', commentScheme)