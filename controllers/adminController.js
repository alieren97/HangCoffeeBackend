const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
    console.log(req.params.userId)
    const user = await User.findById(req.params.userId)
    console.log(user)
    if (!user) {
        return next(new ErrorHandler('User not found', 400))
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