const User = require('../models/user')
const Employee = require('../models/employee')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

exports.addEmployee = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }
    const employee = await Employee.create({ cafe: req.params.cafeId, user: req.params.userId, workingType: req.body.workingType })

    res.status(200).json({
        success: true,
        message: `${user.name}  added as employee to your cafe as ${employee.workingType}`,
    })
})

exports.getEmployees = catchAsyncErrors(async (req, res, next) => {
    const employees = await Employee.find({ cafe: req.params.cafeId }).populate('user')
    res.status(200).json({
        success: true,
        length: employees.length,
        data: employees
    })
})

exports.updateEmployee = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }
    const employee = await Employee.findOne({ user: req.params.userId })
    if (!employee) {
        return next(new ErrorHandler('There is no Employee with that user id', 404))
    }

    const updatedEmployee = await Employee.findOneAndUpdate({ user: req.params.userId }, { $set: { workingType: req.body.workingType } }, { new: true })

    res.status(200).json({
        success: true,
        message: `${user.name}  added as employee to your cafe as ${updatedEmployee.workingType}`,
    })
})

exports.deleteEmployee = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }
    const employee = await Employee.findOne({ user: req.params.userId })
    if (!employee) {
        return next(new ErrorHandler('There is no Employee with that user id', 404))
    }
    await Employee.findOneAndDelete({ user: req.params.userId })

    res.status(200).json({
        success: true,
        message: `${user.name} deleted from your cafe as employee`,
    })
})