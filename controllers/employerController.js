const User = require('../models/user')
const Cafe = require('../models/cafe')
const Employee = require('../models/employee')
const FoodCard = require('../models/foodCard')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

exports.addEmployee = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.params.userId)
    if (!user) {
        return next(new ErrorHandler('User not found', 404))
    }
    if (user.cafe != null) {
        return next(new ErrorHandler('User already working in a cafe', 400))
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
    const employee = await Employee.findOne({ user: req.params.userId, cafe: user.cafe })
    if (!employee) {
        return next(new ErrorHandler('There is no Employee in your cafe with that user id', 404))
    }
    // Dont delete it keep the info
    await Employee.findOneAndDelete({ user: req.params.userId })
    await User.findByIdAndUpdate(user._id, { $pull: { role: "employee" }, $unset: { employee: null, cafe: null } })
    await Cafe.findByIdAndUpdate(this.cafe, { $pull: { employees: employee._id } },)

    res.status(200).json({
        success: true,
        message: `${user.name} deleted from your cafe as employee`,
    })
})

exports.updateCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    const updatedCafe = await Cafe.findByIdAndUpdate(req.params.cafeId, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        message: `${updatedCafe.name} is updated successfully`,
    })
})

exports.getFoodCards = catchAsyncErrors(async (req, res, next) => {
    const foodCards = await FoodCard.find()

    res.status(200).json({
        success: true,
        message: null,
        length: foodCards.length,
        data: foodCards
    })
})