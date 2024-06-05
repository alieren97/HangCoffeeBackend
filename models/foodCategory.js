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

// foodCategoryScheme.pre('save', async function () {
//     try {
//         // Find the user document and update its posts array with the new post
//         await Cafe.findByIdAndUpdate(
//           this.cafe,
//           { $push: { menu: this._id } },
//           { new: true }
//         );
       
//       } catch (err) {
//         console.error(err);
//       }
// })

module.exports = mongoose.model('FoodCategory', foodCategoryScheme, 'foodCategory')