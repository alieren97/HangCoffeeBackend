const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController')
const { isAuthenticatedUser, checkOwner } = require('../middlewares/auth');

orderRouter.route('/create/:tableId')
    .post(isAuthenticatedUser, orderController.addOrder)
// orderRouter.route('/:checkId').get(isAuthenticatedUser, checkController.getCheckByTableId)
orderRouter.route('/approve/:orderId')
    .put(isAuthenticatedUser, orderController.approveOrder)
orderRouter.route('/:orderId')
    .get(isAuthenticatedUser, orderController.detailByOrderId)
orderRouter.route('/')
    .get(isAuthenticatedUser, checkOwner, orderController.getOrdersByCafe)

module.exports = orderRouter;

