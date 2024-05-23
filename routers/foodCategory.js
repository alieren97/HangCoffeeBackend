const express = require('express');
const foodCategoryRouter = express.Router();
const foodCategoryController = require('../controllers/foodCategoryController')
const { isAuthenticatedUser, authorizeRoles, checkOwner } = require('../middlewares/auth')

foodCategoryRouter.route('/:cafeId')
    .get(foodCategoryController.getCategoriesByCafe)
    .post(isAuthenticatedUser, checkOwner, authorizeRoles('employeer', 'admin'), foodCategoryController.addCategory)
foodCategoryRouter.route('/:cafeId/:categoryId')
    .get(isAuthenticatedUser, authorizeRoles('employeer'), foodCategoryController.getCategoryByCafe)
    .put(isAuthenticatedUser, checkOwner, authorizeRoles('employeer'), foodCategoryController.updateCategoryByCafe)
    .delete(isAuthenticatedUser, checkOwner, authorizeRoles('employeer'), foodCategoryController.deleteCategoryByCafe)

module.exports = foodCategoryRouter