const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"]
    },
    email: {
        type: String,
        required: [true, "Please enter your email adress"],
        unique: true,
        validate: [validator.isEmail, 'Please enter valid email address.']
    },
    role: {
        type: [String],
        enum: {
            values: ['user', 'manager', 'employeer', 'employee', 'admin', 'super admin'],
            message: 'Please select correct role'
        },
        default: ["user"],
    },
    password: {
        type: String,
        required: [true, 'Please enter password for your account'],
        minlength: [8, 'Your password must be at least 8 characters long'],
        select: false
    },
    cafe: {
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe'
    },
    work: {
        type: String,
        maxlength: [20, "Please add some shortcut of the work"]
    },
    favoriteCafes: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Cafe'
    }],
    workingType: {
        type: String,
        enum: {
            values: ['Full-Time', 'Part-Time'],
            message: 'Please select an option full or part'
        },
    },
    image: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,
})

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.getJwtToken = function () {
    return jwt.sign({ id: this._id, }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })
}

//Compare user password in database password
userSchema.methods.comparePassword = async function (enterPassword) {
    return await bcrypt.compare(enterPassword, this.password);
}

module.exports = mongoose.model('User', userSchema);