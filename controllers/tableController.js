const Cafe = require("../models/cafe");
const Table = require("../models/table");
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { createTableBodyValidation, updateTableBodyValidation } = require('../utils/validationSchema')

exports.addTable = catchAsyncErrors(async (req, res, next) => {
    const table = await Table.findOne({ tableName: req.body.tableName, cafe: req.user.cafe })
    if (table) {
        return next(new ErrorHandler('Table name already exist', 404))
    }
    const { error } = createTableBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 401)
    await Table.create({ tableName: req.body.tableName, cafe: req.user.cafe, quota: req.body.quota, tableInfo: req.body.tableInfo })
    res.status(200).json({
        success: true,
        message: "Table created",
    })
})

exports.getTables = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    const tables = await Table.find({ cafe: cafe })
    res.status(200).json({
        success: true,
        count: tables.length,
        data: tables
    })
})

exports.getTable = catchAsyncErrors(async (req, res, next) => {

    const table = await Table.findById(req.params.tableId)
    if (!table) {
        return next(new ErrorHandler('Table not found', 404))
    }

    res.status(200).json({
        success: true,
        data: table
    })
})

exports.updateTable = catchAsyncErrors(async (req, res, next) => {

    const table = await Table.findById(req.params.tableId)
    if (!table) {
        return next(new ErrorHandler('Table not found', 404))
    }
    const { error } = updateTableBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 401)
    await Table.findByIdAndUpdate(req.params.tableId, req.body, {
        new: true,
        runValidators: true,
    })
    res.status(200).json({
        success: true,
        message: "Table updated",
    })
})

exports.deleteTable = catchAsyncErrors(async (req, res, next) => {
    const table = await Table.findById(req.params.tableId)
    if (!table) {
        return next(new ErrorHandler('Table not found', 404))
    }
    await Table.findByIdAndDelete(req.params.tableId);
    res.status(200).json({
        success: true,
        message: `${table.tableName} is deleted`,
    })
})