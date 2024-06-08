const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const i18n = require('i18n')
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('user.user_not_found_error', 404))
    }

    const givenRole = req.body.role
    const includesTheRole = user.role.includes(givenRole)
    var message = "admin.admin_update_role_user_already_has_the_role"

    if (includesTheRole) {
        return next(new ErrorHandler(i18n.__('admin.admin_update_role_user_already_has_the_role', { role: givenRole }), 400))
    }
    await User.findOneAndUpdate({ _id: req.params.userId }, { $push: { role: givenRole } }, { new: true })

    res.status(200).json({
        success: true,
        message: res.__('admin.admin_update_role_user_updated_successfully', { email: user.email, role: givenRole })
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
        return next(new ErrorHandler("user.user_not_found_error", 400))
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
        return next(new ErrorHandler("user.user_not_found_error", 400))
    }
    await User.findByIdAndDelete(req.params.userId)

    res.status(200).json({
        success: true,
        message: res.__('admin.admin_user_deleted_successfully', { name: user.name })
    })
})