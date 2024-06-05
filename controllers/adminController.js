const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }

    const givenRole = req.body.role
    const includesTheRole = user.role.includes(givenRole)
    if (includesTheRole) {
        return next(new ErrorHandler(`User already has the ${givenRole} `, 400))
    }
    await User.findOneAndUpdate({ _id: req.params.userId }, { $push: { role: givenRole } }, { new: true })

    res.status(200).json({
        success: true,
        message: `${user.email} role added into roles as ${givenRole}`,
    })
})

exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find()
    res.status(200).json({
        success: true,
        message: null,
        length: users.length,
        data: users
    })
})

exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler("User not found ", 400))
    }
    res.status(200).json({
        success: true,
        message: null,
        data: user
    })
})

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler("User not found ", 400))
    }
    await User.findByIdAndDelete(req.params.userId)

    res.status(200).json({
        success: true,
        message: `${user.name} deleted successfully`,
    })
})