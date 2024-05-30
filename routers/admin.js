const express = require('express')
const adminRouter = express.Router()
const adminController = require('../controllers/adminController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

adminRouter.route('/updateRole/:userId')
    .put(isAuthenticatedUser, authorizeRoles("admin", "super admin"), adminController.updateUserRole)

module.exports = adminRouter