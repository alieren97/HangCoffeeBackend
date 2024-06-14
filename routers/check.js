const express = require('express');
const checkRouter = express.Router();
const checkController = require('../controllers/checkController')
const { isAuthenticatedUser, checkEmployee } = require('../middlewares/auth')

checkRouter.route('/:checkId').get(isAuthenticatedUser, checkController.getCheckByTableId)
checkRouter.route('/:checkId/paid').put(isAuthenticatedUser, checkEmployee, checkController.checkPaid)
checkRouter.route('/').get(isAuthenticatedUser, checkEmployee, checkController.getChecksByCafe)

module.exports = checkRouter;

