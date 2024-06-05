const express = require('express')
const cafeRouter = express.Router();
const cafeController = require('../controllers/cafeController.js')
const { isAuthenticatedUser, authorizeRoles, checkOwner } = require('../middlewares/auth')

cafeRouter.route('/')
    .get(cafeController.getAllCafes)
    .post(isAuthenticatedUser, authorizeRoles('employer', 'admin'), cafeController.createCafe)
cafeRouter.route('/:cafeId')
    .get(cafeController.getCafe)
    .put(isAuthenticatedUser, checkOwner, authorizeRoles('employer', 'admin'), cafeController.updateCafe)
    .delete(isAuthenticatedUser, checkOwner, authorizeRoles('employer', 'admin'), cafeController.deleteCafe)

module.exports = cafeRouter;