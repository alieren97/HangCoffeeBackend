const mongoose = require('mongoose')
const Table = require('./table')

const checkSchema = new mongoose.Schema({
    table: {
        type: mongoose.Schema.ObjectId,
        ref: 'Table',
        required: true
    },
    orders: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Order'
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

checkSchema.pre('save', async function () {
    var check = await this.populate({
        path: 'orders',
        populate: {
            path: 'foods',
            populate: {
                path: 'food'
            }
        }
    })
    var total_price = 0
    for await (var order of check.orders) {
        for await (var food of order.foods) {
            total_price += food.quantity * food.food.price
        }
    }
    console.log(total_price)
    this.total_price = total_price
})

module.exports = mongoose.model('Check', checkSchema, 'check')