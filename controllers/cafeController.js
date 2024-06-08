const User = require('../models/user')
const Cafe = require('../models/cafe.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const i18n = require('i18n')
const { createCafeBodyValidation, updateCafeBodyValidation } = require('../utils/validationSchema')

exports.getAllCafes = catchAsyncErrors(async (req, res, next) => {
    const cafes = await Cafe.find().populate('food_card');
    res.status(200).json({
        success: true,
        length: cafes.length,
        data: cafes
    })
});

exports.getCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId).populate('food_card')
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    } else {
        res.status(200).json({
            success: true,
            data: cafe
        })
    }
});

exports.createCafe = catchAsyncErrors(async (req, res, next) => {
    req.body.owner = req.user.id
    const { error } = createCafeBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 401)

    var cafe = await Cafe.findOne({ name: req.body.name })
    if (cafe) {
        return next(new ErrorHandler(i18n.__('cafe.cafe_already_has_the_same_name_error', { cafeName: req.body.name }), 404))
    }
    cafe = await Cafe.create(req.body);
    await User.findByIdAndUpdate(req.user.id, { $set: { cafe: cafe.id } }, { new: true })

    res.status(200).json({
        success: true,
        message: 'cafe.cafe_created_successfully',
        data: cafe
    })
})

exports.updateCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found_error', 404))
    }

    const { error } = updateCafeBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 401)

    const updatedCafe = await Cafe.findByIdAndUpdate(req.params.cafeId, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        message: 'cafe.cafe_updated_successfully',
        data: updatedCafe
    })
})

exports.deleteCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found_error', 404))
    }
    await Cafe.findByIdAndDelete(req.params.cafeId);
    res.status(200).json({
        success: true,
        message: i18n.__('cafe.cafe_deleted_successfully', { cafeName: cafe.name }),
    })
})