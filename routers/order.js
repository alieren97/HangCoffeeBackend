const express = require('express');
const orderRouter = express.Router();
const orderController = require('../controllers/orderController')
const { isAuthenticatedUser, checkEmployee } = require('../middlewares/auth');

orderRouter.route('/:tableId/create')
    .post(isAuthenticatedUser, orderController.addOrder)
// orderRouter.route('/:checkId').get(isAuthenticatedUser, checkController.getCheckByTableId)
orderRouter.route('/:orderId/approve')
    .put(isAuthenticatedUser, checkEmployee, orderController.approveOrder)
orderRouter.route('/:orderId')
    .get(isAuthenticatedUser, orderController.detailByOrderId)
orderRouter.route('/:orderId/cancel')
    .put(isAuthenticatedUser, orderController.cancelOrder)

orderRouter.route('/')
    .get(isAuthenticatedUser, checkEmployee, orderController.getOrdersByCafe)

module.exports = orderRouter;

