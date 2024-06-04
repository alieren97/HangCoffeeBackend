const mongoose = require('mongoose')

const foodCardSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('FoodCard', foodCardSchema, 'foodcard')