const mongoose = require('mongoose')
const Table = require('./table')

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
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
    createdAt: {
        type: Date,
        default: Date.now
    },
    closedAt: {
        type: Date,
    },
    is_approved: {
        type: Boolean,
        default: false
    },
    is_approved_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Order', orderSchema, 'order')