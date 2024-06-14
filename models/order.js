const mongoose = require('mongoose')
const Table = require('./table');
const { calculateDateDifference, formatDate } = require('../utils/dateUtils');
// Helper function to format the date

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
    createdDate: {
        type: Date,
        default: Date.now,
        get: formatDate
    },
    closedAt: {
        type: Date,
    },
    is_cancelled: {
        type: Boolean,
        default: false
    },
    is_cancelled_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    is_approved: {
        type: Boolean,
        default: false
    },
    is_approved_by: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }
}, { timestamps: { createdAt: true, updatedAt: false } })

orderSchema.virtual('dateDiff').get(function () {
    const currentDate = new Date();
    const { days, hours, minutes } = calculateDateDifference(this.createdAt, currentDate)
    if (hours > 24) {
        return `${days}d`;
    } else if (hours < 1) {
        return `${minutes}m`;
    } else {
        return `${hours}h`;
    }
});

// Ensure getters are included when converting to JSON
orderSchema.set('toJSON', { getters: true });
orderSchema.set('toObject', { getters: true });

module.exports = mongoose.model('Order', orderSchema, 'order')