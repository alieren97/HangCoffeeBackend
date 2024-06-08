const Cafe = require("../models/cafe");
const FoodCategory = require('../models/foodCategory')
// const Food = require('../models/food')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { createFoodCategoryBodyValidation } = require('../utils/validationSchema.js')

exports.addCategory = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)

    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }

    const { error } = createFoodCategoryBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)

    await FoodCategory.create({ cafe: cafe, categoryName: req.body.categoryName, categoryImage: req.body.categoryImage })
    res.status(200).json({
        success: true,
        message: "category.category_added_successfully",
    })
})

exports.getCategoryByCafe = catchAsyncErrors(async (req, res, next) => {
    const category = await FoodCategory.findById(req.params.categoryId)
    if (!category) {
        return next(new ErrorHandler('category.category_not_found', 404))
    }
    res.status(200).json({
        success: true,
        message: null,
        data: category
    })
})

exports.getCategoriesByCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }
    const categories = await FoodCategory.find({ cafe: cafe._id }).populate('foods')
    res.status(200).json({
        success: true,
        message: null,
        length: categories.length,
        data: categories
    })
})

exports.updateCategoryByCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }

    const category = await FoodCategory.findById(req.params.categoryId)
    if (!category) {
        return next(new ErrorHandler('category.category_not_found', 404))
    }

    await FoodCategory.findByIdAndUpdate(category._id, { $set: req.body }, { new: true })
    res.status(200).json({
        success: true,
        message: "category.category_updated_successfully"
    })
})

exports.deleteCategoryByCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }
    const category = await FoodCategory.findById(req.params.categoryId)
    if (!category) {
        return next(new ErrorHandler('category.category_not_found', 404))
    }
    await FoodCategory.findByIdAndDelete(categoryId)
    res.status(200).json({
        success: true,
        message: "category.category_deleted_successfully"
    })
})