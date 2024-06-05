const express = require('express')
const employeerRouter = express.Router()
const employerController = require('../controllers/employerController')
const { isAuthenticatedUser, authorizeRoles, checkOwner } = require('../middlewares/auth')

employeerRouter.route('/employee/:userId')
    .post(isAuthenticatedUser, checkOwner, employerController.addEmployee)
    .put(isAuthenticatedUser, checkOwner, employerController.updateEmployee)
    .delete(isAuthenticatedUser, checkOwner, employerController.deleteEmployee)

employeerRouter.route('/employees')
    .get(isAuthenticatedUser, checkOwner, employerController.getEmployees)

employeerRouter.route('/updateCafe')
    .put(isAuthenticatedUser, checkOwner, employerController.updateCafe)

module.exports = employeerRouter