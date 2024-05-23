const express = require('express');
const tableRouter = express.Router();

const tableController = require('../controllers/tableController')
const { isAuthenticatedUser, checkOwner } = require('../middlewares/auth')

tableRouter.route('/:cafeId')
    .get(isAuthenticatedUser, tableController.getTables)
    .post(isAuthenticatedUser, checkOwner, tableController.addTable)

tableRouter.route('/:cafeId/:tableId')
    .get(isAuthenticatedUser, tableController.getTable)
    .put(isAuthenticatedUser, checkOwner, tableController.updateTable)
    .delete(isAuthenticatedUser, checkOwner, tableController.deleteTable)

module.exports = tableRouter;