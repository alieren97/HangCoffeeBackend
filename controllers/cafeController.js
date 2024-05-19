const User = require('../models/user')
const Cafe = require('../models/cafe.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { createCafeBodyValidation, updateCafeBodyValidation } = require('../utils/validationSchema')

exports.getAllCafes = catchAsyncErrors(async (req, res, next) => {
    const cafes = await Cafe.find();
    res.status(200).json({
        success: true,
        length: cafes.length,
        data: cafes
    })
});

exports.getCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
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
        return next(new ErrorHandler(`There is a cafe with the same name ${req.body.name}`, 404))
    } else {
        cafe = await Cafe.create(req.body);
        await User.findByIdAndUpdate(req.user.id, { $set: { cafe: cafe.id } }, { new: true })
    }
    res.status(200).json({
        success: true,
        message: "Cafe created",
        data: cafe
    })
})

exports.updateCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
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
        message: 'Cafe is updated',
        data: updatedCafe
    })
})

exports.deleteCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    await Cafe.findByIdAndDelete(req.params.cafeId);
    res.status(200).json({
        success: true,
        message: `${cafe.name} Cafe is deleted`,
    })
})