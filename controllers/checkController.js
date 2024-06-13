const Check = require('../models/check')
const Table = require('../models/table')
const Food = require('../models/food')
const CheckFood = require('../models/checkFood')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const i18n = require('i18n')
const { populate } = require('../models/user')

// exports.addCheck = catchAsyncErrors(async (req, res, next) => {
//     const table = await Table.findById(req.params.tableId).populate('check')
//     var items = req.body.checkFoods
//     var total = 0

//     if (!table) {
//         return next(new ErrorHandler('table.table_not_found', 404))
//     }
//     if (table.check != null) {
//         var check = await Check.findById(table.check._id).populate('foods')
//         total += check.total_price
//         for await (var item of items) {
//             const productIndex = check.foods.findIndex(p => p.food.toString() == item.food);
//             if (productIndex > -1) {
//                 const checkFood = await CheckFood.findById(check.foods[productIndex]._id)
//                 if (checkFood.quantity != item.quantity) {
//                     await CheckFood.findByIdAndUpdate(check.foods[productIndex]._id, { $set: { quantity: item.quantity } }, { new: true })
//                     const food = await Food.findById(item.food)
//                     if (checkFood.quantity < item.quantity) {
//                         total += (item.quantity - checkFood.quantity) * food.price
//                     } else {
//                         total -= (checkFood.quantity - item.quantity) * food.price
//                     }
//                 }
//             } else {
//                 const checkFood = await CheckFood.create({ user: req.user.id, table: req.params.tableId, check: check.id, quantity: item.quantity, food: item.food })
//                 const food = await Food.findById(item.food)
//                 total += item.quantity * food.price
//                 check.foods.push(checkFood)
//             }
//         }
//         check.total_price = total
//         await check.save()
//         return res.status(200).json({
//             success: true,
//             message: res.__("check.check_items_updated_successfully"),
//         })
//     }

//     var check = await Check.create({ cafe: table.cafe, table: req.params.tableId })
//     for await (var item of items) {
//         const checkFood = await CheckFood.create({ user: req.user.id, table: req.params.tableId, check: check.id, quantity: item.quantity, food: item.food })
//         const food = await Food.findById(item.food)
//         check.total_price += checkFood.quantity * food.price
//         check.foods.push(checkFood)
//     }
//     await check.save()
//     await Table.findByIdAndUpdate(table._id, { $set: { check: check._id } }, { new: true })
//     res.status(200).json({
//         success: true,
//         message: res.__("check.check_created_successfully")
//     })

// })

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
    var total_price = 0
    for await (var order of check.orders) {
        for await (var food of order.foods) {
            total_price += food.quantity * food.food.price
        }
    }

    check.total_price = total_price
    check.save()
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
