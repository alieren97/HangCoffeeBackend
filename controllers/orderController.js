const Check = require('../models/check')
const Table = require('../models/table')
const Food = require('../models/food')
const CheckFood = require('../models/checkFood')
const Order = require('../models/order')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const i18n = require('i18n')


exports.addOrder = catchAsyncErrors(async (req, res, next) => {
    const tableId = req.params.tableId
    const table = await Table.findById(tableId)
    if (!table) {
        return next(new ErrorHandler('table.table_not_found', 404))
    }

    const items = req.body.foods
    var checkFoods = []
    for await (var item of items) {
        const checkFood = await CheckFood.create({ food: item.food, quantity: item.quantity })
        checkFoods.push(checkFood)
    }
    await Order.create({ user: req.user._id, foods: checkFoods, table: tableId, cafe: table.cafe })

    res.status(200).json({
        success: true,
        message: "Order başarılı bir şekilde oluşturuldu"
    })
})

exports.detailByOrderId = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId).populate('foods')

    res.status(200).json({
        success: true,
        data: order
    })
})

exports.getOrdersByCafe = catchAsyncErrors(async (req, res, next) => {
    const query = req.query;
    const cafeId = req.user.cafe
    const orders = await Order.find({ cafe: cafeId, is_approved: query.is_approved })

    res.status(200).json({
        success: true,
        length: orders.length,
        data: orders
    })
})

exports.approveOrder = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (!order) {
        // Order not found
        return next(new ErrorHandler('table.table_not_found', 404))
    }
    const table = await Table.findById(order.table)
    if (!table) {
        // Table not found
        return next(new ErrorHandler('table.table_not_found', 404))
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { is_approved: req.body.is_approved, is_approved_by: req.user._id } }, { new: true })
    if (updatedOrder.is_approved == true) {
        if (table.check != null) {
            await Check.findByIdAndUpdate(table.check, { $push: { orders: order._id } }, { new: true })
        } else {
            const check = await Check.create({ cafe: updatedOrder.cafe, table: table._id, orders: [orderId] })
            await Table.findByIdAndUpdate(order.table, { $set: { check: check._id } }, { new: true })
        }
    } else {
        return res.status(400).json({
            success: true,
            message: "Order successfully declined"
        })
    }

    res.status(200).json({
        success: true,
        message: "Order successfully approved"
    })
})