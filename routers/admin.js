const express = require('express')
const adminRouter = express.Router()
const adminController = require('../controllers/adminController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

adminRouter.route('/users/:userId/updateRole')
    .put(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.updateUserRole)

adminRouter.route('/users')
    .get(isAuthenticatedUser, authorizeRoles("admin", "employeer", "super admin"), adminController.getAllUsers)

adminRouter.route('/users/:userId')
    .get(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.getUser)
    .delete(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.deleteUser)

adminRouter.route('/foodCards')
    .get(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.getFoodCards)
    .post(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.createFoodCard)

adminRouter.route('/foodCards/:foodCardId')
    .delete(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.deleteFoodCard)

adminRouter.route('/onlineOrders')
    .get(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.getOnlineOrders)
    .post(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.createOnlineOrder)

adminRouter.route('/onlineOrders/:onlineOrderId')
    .delete(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.deleteOnlineOrder)

module.exports = adminRouter