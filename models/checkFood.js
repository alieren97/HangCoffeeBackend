
const mongoose = require('mongoose')
const Table = require('./table')

const checkFoodSchema = new mongoose.Schema({
    quantity: {
        type: Number,
        required: true,
        default: 1
    },
    food: {
        type: mongoose.Schema.ObjectId,
        ref: "Food",
        required: [true, "Please enter a name for the food"]
    }
})

module.exports = mongoose.model('CheckFood', checkFoodSchema, 'checkFood')