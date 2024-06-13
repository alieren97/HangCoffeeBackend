const mongoose = require('mongoose')
const FoodCategory = require('./foodCategory')

const foodScheme = new mongoose.Schema({
    foodImage: {
        type: String
    },
    foodName: {
        type: String,
        required: [true, "Please enter a name for the food"]
    },
    foodDetail: {
        type: String,
        required: [true, "Please enter a detail for the food"]
    },
    foodDetailCategory: {
        type: [String],
        enum: {
            values: ['Gluten-Free', 'Vegan'],
            message: 'Please select correct food detail category type'
        },
    },
    price: {
        type: Number,
        required: [true, "Please enter a price for this food"]
    },
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: true
    },
    foodCategory: {
        type: mongoose.Schema.ObjectId,
        ref: 'FoodCategory',
        required: [true, "Please provide Category id"]
    },
})

foodScheme.pre('save', async function () {
    try {
        // Find the user document and update its posts array with the new post
        await FoodCategory.findByIdAndUpdate(
            this.foodCategory,
            { $push: { foods: this._id } },
            { new: true }
        );
    } catch (err) {
        console.error(err);
    }
})

module.exports = mongoose.model('Food', foodScheme, 'food')