const mongoose = require('mongoose')
const User = require("./user")
const Cafe = require("./cafe")

const jobSchema = new mongoose.Schema({
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: true
    },
    position: {
        type: String,
        enum: {
            values: ['Barista', 'Service', 'Chef', 'Manager'],
            message: 'Please select correct working Type'
        },
        required: true
    },
    job_type: {
        type: String,
        enum: {
            values: ['Full-Time', 'Part-Time'],
            message: 'Please select correct working Type'
        },
        required: [true, 'You have to add the job type like full or part time'],
    },
    experience_type: {
        type: String,
        enum: {
            values: ['0-1 year', '2 years', '2+ years'],
            message: 'Please select the experience type'
        },
        required: [true, 'You have to add the experience type'],
    },
    appliedBy: {
        type: [mongoose.Schema.ObjectId],
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }

    //experience ekle
})

module.exports = mongoose.model('Job', jobSchema, 'job')