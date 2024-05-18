const User = require('../models/user')
const Cafe = require('../models/cafe.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

exports.getAllCafes = catchAsyncErrors(async (req, res, next) => {
    let cafes = await Cafe.find();
    res.status(200).json({
        success: true,
        length: cafes.length,
        data: cafes
    })
});

exports.getCafe = catchAsyncErrors(async (req, res, next) => {
    console.log(req.params.cafeId)
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
    var cafe = await Cafe.findOne({ name: req.body.name })
    if (cafe) {
        return next(new ErrorHandler(`There is a cafe with the same name ${req.body.name}`, 404))
    } else {
        cafe = await Cafe.create(req.body);
        await User.findByIdAndUpdate(req.user.id, { $set: { cafe: cafe.id } }, { new: true })
    }
    res.status(200).json({
        success: true,
        dialogType: "snackBar",
        message: "Cafe created",
        data: cafe
    })
})

exports.updateCafe = catchAsyncErrors(async (req, res, next) => {
    let cafe = await Cafe.findById(req.params.id)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    cafe = await Cafe.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    res.status(200).json({
        success: true,
        dialogType: "snackBar",
        message: 'Cafe is updated',
        data: cafe
    })
})

exports.deleteCafe = catchAsyncErrors(async (req, res, next) => {
    let cafe = await Cafe.findById(req.params.id)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    cafe = await Cafe.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success: true,
        dialogType: "snackBar",
        message: `${cafe.name} Cafe is deleted`,
    })
})