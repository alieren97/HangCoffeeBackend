const express = require('express');
const foodCategoryRouter = express.Router();
const foodCategoryController = require('../controllers/foodCategoryController')
const { isAuthenticatedUser, checkOwner } = require('../middlewares/auth')

foodCategoryRouter.route('/cafe/:cafeId')
    .get(foodCategoryController.getCategoriesByCafe)
foodCategoryRouter.route('/addCategory')
    .post(isAuthenticatedUser, checkOwner, foodCategoryController.addCategory)
foodCategoryRouter.route('/:categoryId')
    .get(isAuthenticatedUser, checkOwner, foodCategoryController.getCategoryByCafe)
    .put(isAuthenticatedUser, checkOwner, foodCategoryController.updateCategoryByCafe)
    .delete(isAuthenticatedUser, checkOwner, foodCategoryController.deleteCategoryByCafe)

module.exports = foodCategoryRouter