const express = require('express');
const checkRouter = express.Router();
const checkController = require('../controllers/checkController')
const { isAuthenticatedUser } = require('../middlewares/auth')

checkRouter.post('/table/:tableId', isAuthenticatedUser, checkController.addCheck)
checkRouter.route('/:checkId').get(isAuthenticatedUser, checkController.getCheckByTableId)
checkRouter.route('/:checkId/paid').put(isAuthenticatedUser, checkController.checkPaid)

module.exports = checkRouter;

