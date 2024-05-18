const express = require('express')
const cafeRouter = express.Router();
const cafeController = require('../controllers/cafeController.js')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

cafeRouter.route('/')
    .get(isAuthenticatedUser, cafeController.getAllCafes)
    .post(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), cafeController.createCafe)
cafeRouter.route('/:cafeId')
    .get(cafeController.getCafe)
    .put(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), cafeController.updateCafe)
    .delete(isAuthenticatedUser, authorizeRoles('employeer', 'admin'), cafeController.deleteCafe)

module.exports = cafeRouter;