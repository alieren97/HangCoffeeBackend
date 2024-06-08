const Cafe = require("../models/cafe");
const FoodCategory = require('../models/foodCategory')
const Food = require('../models/food')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { createFoodBodyValidation } = require('../utils/validationSchema.js')

exports.addFood = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }

    const { error } = createFoodBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)

    const foodCategory = await FoodCategory.findById(req.body.foodCategory)
    if (!foodCategory) {
        return next(new ErrorHandler('category.category_not_found', 404))
    }

    await Food.create({ foodImage: req.body.foodImage, cafe: cafe._id, foodName: req.body.foodName, price: req.body.price, foodCategory: req.body.foodCategory })
    res.status(200).json({
        success: true,
        message: "food.food_added_successfully",
    })
})

exports.getFoodById = catchAsyncErrors(async (req, res, next) => {
    const food = await Food.findById(req.params.foodId)
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
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
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
        return next(new ErrorHandler('food.food_not_found', 404))
    }
    await Food.findByIdAndDelete(foodId)
    await FoodCategory.findByIdAndUpdate(food.foodCategory, { $pull: { foods: foodId } }, { new: true })
    res.status(200).json({
        success: true,
        message: "food.food_deleted_successfully"
    })
})

exports.updateFood = catchAsyncErrors(async (req, res, next) => {
    const foodId = req.params.foodId
    const food = await Food.findById(foodId)
    if (!food) {
        return next(new ErrorHandler('food.food_not_found', 404))
    }
    const updatedFood = await Food.findByIdAndUpdate(foodId, { $set: req.body }, { new: true })
    res.status(200).json({
        success: true,
        message: "food.food_updated_successfully",
        data: updatedFood
    })
})

exports.getFoodsByCategoryId = catchAsyncErrors(async (req, res, next) => {
    const foodCategory = await FoodCategory.findById(req.params.categoryId)
    if (!foodCategory) {
        return next(new ErrorHandler('category.category_not_found', 404))
    }
    const foods = await Food.find({ foodCategory: foodCategory._id })
    res.status(200).json({
        success: true,
        message: null,
        length: foods.length,
        data: foods
    })
})

