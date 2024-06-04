const User = require('../models/user')
const FoodCard = require('../models/foodCard')
const OnlineOrder = require('../models/onlineOrder')
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

exports.createFoodCard = catchAsyncErrors(async (req, res, next) => {
    const checkFoodCard = await FoodCard.findOne({ name: req.body.name })
    if (checkFoodCard) {
        return next(new ErrorHandler("There is a food card with that name ", 400))
    }
    await FoodCard.create(req.body)

    res.status(200).json({
        success: true,
        message: `${req.body.name} food card created`,
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

exports.deleteFoodCard = catchAsyncErrors(async (req, res, next) => {
    const checkFoodCard = await FoodCard.findById(req.params.foodCardId)
    if (!checkFoodCard) {
        return next(new ErrorHandler("There is no food card with that id ", 400))
    }

    await FoodCard.findByIdAndDelete(req.params.foodCardId)

    res.status(200).json({
        success: true,
        message: "Food card deleted successfully",
    })
})


exports.createOnlineOrder = catchAsyncErrors(async (req, res, next) => {
    const checkOnlineOrder = await OnlineOrder.findOne({ name: req.body.name })
    if (checkOnlineOrder) {
        return next(new ErrorHandler("There is a food card with that name ", 400))
    }
    await OnlineOrder.create(req.body)

    res.status(200).json({
        success: true,
        message: `${req.body.name} online order created`,
    })
})

exports.getOnlineOrders = catchAsyncErrors(async (req, res, next) => {
    const onlineOrders = await OnlineOrder.find()

    res.status(200).json({
        success: true,
        message: null,
        length: onlineOrders.length,
        data: onlineOrders
    })
})

exports.deleteOnlineOrder = catchAsyncErrors(async (req, res, next) => {
    const checkOnlineOrder = await OnlineOrder.findById(req.params.onlineOrderId)
    if (!checkOnlineOrder) {
        return next(new ErrorHandler("There is no online order object with that id ", 400))
    }

    await OnlineOrder.findByIdAndDelete(req.params.onlineOrderId)

    res.status(200).json({
        success: true,
        message: "Online order deleted successfully",
    })
})