const { required } = require('joi')
const mongoose = require('mongoose')
const Cafe = require('./cafe')
const User = require('./user')

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
        // Find the user document and update its posts array with the new post
        await Cafe.findByIdAndUpdate(
            this.cafe,
            { $push: { employees: this._id } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            this.user,
            { $push: { role: "employee" }, $set: { cafe: this.cafe } },
            { new: true }
        );

    } catch (err) {
        console.error(err);
    }
})

employeeSchema.pre('remove', async function () {
    try {
        // Find the user document and update its posts array with the new post
        await Cafe.findByIdAndUpdate(
            this.cafe,
            { $pull: { employees: this._id } },
            { new: true }
        );

        await User.findByIdAndUpdate(
            this.user,
            { $pull: { role: "employee" }, $set: { cafe: null } },
            { new: true }
        );

    } catch (err) {
        console.error(err);
    }
})


module.exports = mongoose.model('Employee', employeeSchema, 'employee')