const Check = require('../models/check')
const Table = require('../models/table')
const Food = require('../models/food')
const CheckFood = require('../models/checkFood')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const i18n = require('i18n')

exports.getCheckByTableId = catchAsyncErrors(async (req, res, next) => {
    const check = await Check.findById(req.params.checkId)
        .populate({
            path: 'orders',
            populate: {
                path: 'foods',
                populate: {
                    path: 'food'
                }
            }
        })
    if (!check) {
        return next(new ErrorHandler('check.check_not_found', 404))
    }
    if (check.isPaid == true) {
        return next(new ErrorHandler('check.check_already_paid', 400))
    }

    res.status(200).json({
        success: true,
        message: null,
        data: check
    })
})

exports.checkPaid = catchAsyncErrors(async (req, res, next) => {
    const check = await Check.findById(req.params.checkId)
    if (!check) {
        return next(new ErrorHandler('check.check_not_found', 404))
    }
    if (check.isPaid == true) {
        return next(new ErrorHandler('check.check_already_paid', 400))
    }
    const updatedCheck = await Check.findByIdAndUpdate(req.params.checkId, { $set: { isPaid: true, payment_method: req.body.payment_method, closedAt: Date.now() } }, { new: true })
    await Table.findByIdAndUpdate(updatedCheck.table, { $unset: { check } }, { new: true })
    res.status(201).json({
        success: true,
        message: res.__("check.check_paid_successfully")
    })
})

exports.getChecksByCafe = catchAsyncErrors(async (req, res, next) => {
    const query = req.query;
    const cafeId = req.user.cafe

    const checks =
        Object.keys(query).length === 0
            ? await Check.find({ cafe: cafeId })
            : await Check.find({ cafe: cafeId, isPaid: query.isPaid }).sort({ createdAt: query.sort })

    res.status(201).json({
        success: true,
        length: checks.length,
        data: checks
    })
})
