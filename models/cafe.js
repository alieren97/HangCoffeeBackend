const mongoose = require('mongoose');

const cafeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter name of the cafe"],
        maxlength: [50, 'Cafe name can not exceed 50 characters.']
    },
    image: {
        type: [String],
        required: [true, "Please add at least one image about your cafe"]
    },
    working_hours: {
        type: String,
        required: [true, "Please enter working hours for your cafe"]
    },
    cafe_type: {
        type: String,
        required: [true, "Please enter cafe type for customers to understand"],
        enum: {
            values: [
                'Cafe',
                'Cafe+Restaurant',
                'Restaurant',
                'Pub',
                'Pub+Restaurant'
            ],
            message: 'Please select right cafe type.'
        }
    },
    address: {
        type: String,
        required: [true, 'Please add an address.']
    },
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    ratings: {
        type: Number
    },
    is_busy: {
        type: String,
        enum: {
            values: [
                'Low',
                'Avarage',
                'High',
            ],
            message: 'Please select busy times.'
        }
    },
    food_card: {
        type: [String],
        enum: {
            values: [
                "Sodexo",
                "Edenred",
                "Tokenflex",
                "Multinet",
                "Hiçbiri"
            ]
        }
    },
    credit_card: {
        type: [String],
        required: [true, "Please enter food card you are aggree with"],
        enum: {
            values: [
                "Mastercard",
                "Visa"
            ]
        }
    },
    online_order: {
        type: [String],
        enum: {
            values: [
                "Getir",
                "Yemeksepeti",
                "Trendyol"
            ]
        }
    },
    about: {
        type: String,
        required: [true, "About section cant extend 1000 characters"]
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    employees: {
        type: [mongoose.Schema.ObjectId],
        ref: 'Employee'
    }
})

module.exports = mongoose.model("Cafe", cafeSchema);