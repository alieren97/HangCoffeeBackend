const Check = require('../models/check')
const Table = require('../models/table')
const Cafe = require('../models/cafe')
const CheckFood = require('../models/checkFood')
const Order = require('../models/order')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { calculateDateDifference } = require('../utils/dateUtils')

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
        message: res.__("order.order_created_successfully")
    })
})

exports.cancelOrder = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    if (!order) {
        return next(new ErrorHandler('order.order_not_found', 404))
    }
    const cafe = await Cafe.findById(order.cafe)
    if (order.is_cancelled) {
        return next(new ErrorHandler('Order allready cancelled', 400))
    }
    if (order.is_approved) {
        return next(new ErrorHandler('Order allready approved', 400))
    }
    if (req.user._id.equals(order.user)) {
        if (calculateDateDifference(order.createdAt, Date()).minutes > 10) {
            await Order.findByIdAndUpdate(orderId, { $set: { is_cancelled: true, is_cancelled_by: req.user._id } }, { new: true })
            return res.status(200).json({
                success: true,
                message: "Order Cancelled successfully"
            })
        }
        return next(new ErrorHandler('Siparişi iptal edebilmen için en az 10 dakika geçmesi gerekli', 404))
    } else if (cafe.employees.some(r => r.equals(req.user._id)) || req.user._id == cafe.owner) {
        await Order.findByIdAndUpdate(orderId, { $set: { is_cancelled: true, is_cancelled_by: req.user._id } }, { new: true })
        return res.status(200).json({
            success: true,
            message: "Order Cancelled successfully"
        })
    }
    res.status(400).json({
        success: true,
        message: "Error occured"
    })
})


exports.detailByOrderId = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId).populate({
        path: 'foods',
        populate: {
            path: 'food'
        }
    })
        .populate('user')
        .populate('is_approved_by')

    res.status(200).json({
        success: true,
        data: order
    })
})
1
exports.getOrdersByCafe = catchAsyncErrors(async (req, res, next) => {
    const query = req.query;
    const cafeId = req.user.cafe
    const orders =
        Object.keys(query).length === 0
            ? await Order.find({ cafe: cafeId }).populate('table')
            : await Order.find({ cafe: cafeId, is_approved: query.is_approved }).sort({ createdAt: query.sort_by_date }).populate('table')

    res.status(200).json({
        success: true,
        length: orders.length,
        data: orders
    })
})

exports.approveOrder = catchAsyncErrors(async (req, res, next) => {
    const orderId = req.params.orderId
    const order = await Order.findById(orderId)
    //order cafe and user cafe check
    if (!order) {
        return next(new ErrorHandler('order.order_not_found', 404))
    }

    if (order.is_approved == true) {
        return next(new ErrorHandler('order.order_already_approved', 404))
    }

    const table = await Table.findById(order.table)
    if (!table) {
        return next(new ErrorHandler('table.table_not_found', 404))
    }

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { $set: { is_approved: req.body.is_approved, is_approved_by: req.user._id } }, { new: true }).populate({ path: 'foods', populate: { path: 'food' } })
    if (updatedOrder.is_approved == true) {
        if (table.check != null) {
            const check = await Check.findById(table.check)
            var items = updatedOrder.foods
            var item_prices = 0
            for await (var food of items) {
                item_prices += food.quantity * food.food.price
            }
            check.total_price += item_prices
            check.orders.push(updatedOrder._id)
            check.save()
        } else {
            const check = await Check.create({ cafe: updatedOrder.cafe, table: table._id, orders: [orderId] })
            await Table.findByIdAndUpdate(order.table, { $set: { check: check._id } }, { new: true })
        }
    } else {
        return res.status(400).json({
            success: true,
            message: res.__("order.order_successfully_declined")
        })
    }

    res.status(200).json({
        success: true,
        message: res.__("order.order_successfully_approved")
    })
})