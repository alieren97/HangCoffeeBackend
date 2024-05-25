const Cafe = require("../models/cafe");
const FoodCategory = require('../models/foodCategory')
const Food = require('../models/food')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { createFoodBodyValidation } = require('../utils/validationSchema.js')

exports.addFood = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    const foodCategory = await FoodCategory.findById(req.params.categoryId)
    if (!foodCategory) {
        return next(new ErrorHandler('Food Category not found', 404))
    }
    req.body.foodCategory = req.params.categoryId
    req.body.cafe = req.params.cafeId

    const { error } = createFoodBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)
    
    await Food.create(req.body)
    res.status(200).json({
        success: true,
        message: "Food Added Successfully",
    })
})

exports.getFoodById = catchAsyncErrors(async (req, res, next) => {
    const foodId = req.params.foodId
    const food = await Food.findById(foodId)
    if (!food) {
        return next(new ErrorHandler('Food not found', 404))
    }
    res.status(200).json({
        success: true,
        message: null,
        data: food
    })
})

exports.getFoodsByCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    const foods = await Food.find({ cafe: cafe })

    res.status(200).json({
        success: true,
        message: null,
        length: foods.length,
        data: foods
    })
})

exports.deleteFood = catchAsyncErrors(async (req, res, next) => {
    const foodId = req.params.foodId
    const food = await Food.findById(foodId)
    if (!food) {
        return next(new ErrorHandler('Food not found', 404))
    }
    await Food.findByIdAndDelete(foodId)
    await FoodCategory.findByIdAndUpdate(food.foodCategory, { $pull: { foods: foodId } }, { new: true })
    res.status(200).json({
        success: true,
        message: "Food deleted successfully"
    })
})

exports.updateFood = catchAsyncErrors(async (req, res, next) => {
    const foodId = req.params.foodId
    const food = await Food.findById(foodId)
    if (!food) {
        return next(new ErrorHandler('Food not found', 404))
    }
    const updatedFood = await Food.findByIdAndUpdate(foodId, { $set: req.body }, { new: true })
    res.status(200).json({
        success: true,
        message: "Food updated successfully",
        data: updatedFood
    })
})