const express = require('express')
const adminRouter = express.Router()
const adminController = require('../controllers/adminController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

adminRouter.route('/users/:userId/updateRole')
    .put(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.updateUserRole)

adminRouter.route('/users')
    .get(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.getAllUsers)

adminRouter.route('/users/:userId')
    .get(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.getUser)

module.exports = adminRouter