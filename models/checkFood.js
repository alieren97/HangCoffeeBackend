
const mongoose = require('mongoose')
const Table = require('./table')

const checkFoodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    check: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: "Check"
    },
    food: {
        type: mongoose.Schema.ObjectId,
        ref: "Food",
        required: [true, "Please enter a name for the food"]
    },
    table: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'Table'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

module.exports = mongoose.model('CheckFood', checkFoodSchema, 'checkFood')