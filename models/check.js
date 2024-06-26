const mongoose = require('mongoose')
const Table = require('./table')

const checkSchema = new mongoose.Schema({
    table: {
        type: mongoose.Schema.ObjectId,
        ref: 'Table',
        required: true
    },
    foods: [{
        type: mongoose.Schema.ObjectId,
        ref: 'CheckFood'
    }],
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: true
    },
    payment_method: {
        type: String,
        enum: {
            values: [
                'Credit Card',
                'Food Card',
                'Cash'
            ],
            message: 'Please select the right payment method'
        }
    },
    total_price: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    closedAt: {
        type: Date
    },
    isPaid: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Check', checkSchema, 'check')