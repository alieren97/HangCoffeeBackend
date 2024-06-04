const express = require('express')
const employeerRouter = express.Router()
const employerController = require('../controllers/employerController')
const { isAuthenticatedUser, authorizeRoles, checkOwner } = require('../middlewares/auth')

employeerRouter.route('/cafe/:cafeId/employee/:userId')
    .post(isAuthenticatedUser, checkOwner, employerController.addEmployee)
    .put(isAuthenticatedUser, checkOwner, employerController.updateEmployee)
    .delete(isAuthenticatedUser, checkOwner, employerController.deleteEmployee)

employeerRouter.route('/cafe/:cafeId/employees')
    .get(isAuthenticatedUser, checkOwner, employerController.getEmployees)

employeerRouter.route('/cafe/:cafeId')
    .put(isAuthenticatedUser, checkOwner, employerController.updateCafe)

employeerRouter.route('/foodCards')
    .get(isAuthenticatedUser, checkOwner, employerController.getFoodCards)


module.exports = employeerRouter