const mongoose = require('mongoose')
const User = require("./user")
const Cafe = require("./cafe")

const employeeSchema = new mongoose.Schema({
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe',
        required: true
    },
    workingType: {
        type: String,
        enum: {
            values: ['barista', 'manager', 'service', 'cook'],
            message: 'Please select correct working Type'
        },
        required: [true, 'You have to add the workingType for this employee'],
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
})

employeeSchema.pre('save', async function () {
    try {
        await User.findByIdAndUpdate(this.user, { $push: { role: "employee" }, $set: { cafe: this.cafe, employee: this._id } }, { new: true })
        await Cafe.findByIdAndUpdate(
            this.cafe,
            { $push: { employees: this._id } },
            { new: true }
        );
    } catch (err) {
        console.error(err);
    }
})

module.exports = mongoose.model('Employee', employeeSchema, 'employee')