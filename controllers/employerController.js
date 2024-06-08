const User = require('../models/user')
const Cafe = require('../models/cafe')
const Employee = require('../models/employee')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const i18n = require('i18n')

exports.addEmployee = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('user.user_not_found', 404))
    }
    if (user.cafe != null) {
        return next(new ErrorHandler('employer.employer_add_employee_user_already_working', 400))
    }
    const employee = await Employee.create({ cafe: req.user.cafe, user: req.params.userId, workingType: req.body.workingType })

    res.status(200).json({
        success: true,
        message: i18n('employer.employer_add_employee_user_added', { userName: user.name, role: employee.workingType })
    })
})

exports.getEmployees = catchAsyncErrors(async (req, res, next) => {
    const employees = await Employee.find({ cafe: req.user.cafe }).populate('user')
    res.status(200).json({
        success: true,
        length: employees.length,
        data: employees
    })
})

exports.updateEmployee = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('user.user_not_found', 404))
    }
    const employee = await Employee.findOne({ user: req.params.userId })
    if (!employee) {
        return next(new ErrorHandler('employer.employer_there_is_no_employee', 404))
    }

    const updatedEmployee = await Employee.findOneAndUpdate({ user: req.params.userId }, { $set: { workingType: req.body.workingType } }, { new: true })

    res.status(200).json({
        success: true,
        message: i18n('employer.employer_updated_the_current_employee_working_type', { userName: user.name, role: employee.workingType }),
    })
})

exports.deleteEmployee = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('user.user_not_found', 404))
    }
    const employee = await Employee.findOne({ user: req.params.userId, cafe: req.user.cafe })
    if (!employee) {
        return next(new ErrorHandler('employer.employer_there_is_no_employee', 404))
    }
    // Dont delete it keep the info
    await Employee.findOneAndDelete({ user: req.params.userId })
    await User.findByIdAndUpdate(user._id, { $pull: { role: "employee" }, $unset: { employee: null, cafe: null } })
    await Cafe.findByIdAndUpdate(this.cafe, { $pull: { employees: employee._id } },)

    res.status(200).json({
        success: true,
        message: i18n('employer.employer_deleted_the_employee_successfully', { userName: user.name }),
    })
})

exports.updateCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }
    const updatedCafe = await Cafe.findByIdAndUpdate(req.user.cafe, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        message: res._('cafe.cafe_updated_successfully'),
    })
})