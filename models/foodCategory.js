const mongoose = require('mongoose')
const Cafe = require('../models/cafe')

const foodCategoryScheme = new mongoose.Schema({
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe'
    },
    categoryImage: {
        type: String
    },
    categoryName: {
        type: String,
        required: [true, "Please enter a category name"]
    },
    foods: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Food'
    }]
})

module.exports = mongoose.model('FoodCategory', foodCategoryScheme, 'foodCategory')