const express = require('express');
const tableRouter = express.Router();

const tableController = require('../controllers/tableController')
const { isAuthenticatedUser, checkOwner } = require('../middlewares/auth')

tableRouter.route('/cafe/:cafeId')
    .get(isAuthenticatedUser, tableController.getTables)

tableRouter.route('/addTable')
    .post(isAuthenticatedUser, checkOwner, tableController.addTable)

tableRouter.route('/:tableId')
    .get(isAuthenticatedUser, tableController.getTable)
    .put(isAuthenticatedUser, checkOwner, tableController.updateTable)
    .delete(isAuthenticatedUser, checkOwner, tableController.deleteTable)

module.exports = tableRouter;