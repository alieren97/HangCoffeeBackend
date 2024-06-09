const Check = require('../models/check')
const Table = require('../models/table')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const i18n = require('i18n')

exports.addCheck = catchAsyncErrors(async (req, res, next) => {
    const table = await Table.findById(req.params.tableId).populate('check')
    if (!table) {
        return next(new ErrorHandler('table.table_not_found', 404))
    }
    if (table.check) {
        return next(new ErrorHandler('check.check_table_already_have_error', 404))
    }

    var check = await Check.create({ cafe: table.cafe, table: req.params.tableId })
})

exports.getCheckByTableId = catchAsyncErrors(async (req, res, next) => {
    const check = await Check.findById(req.params.checkId)
        .populate({
            path: 'foods',
            populate: {
                path: 'food',
                model: "Food"
            }
        })
        .populate({
            path: 'foods',
            populate: {
                path: 'user',
                model: "User"
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
