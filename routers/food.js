const express = require('express');
const foodRouter = express.Router();
const foodController = require('../controllers/foodController')
const { isAuthenticatedUser, checkOwner } = require('../middlewares/auth')

foodRouter.route('/category/:categoryId')
    .get(isAuthenticatedUser, checkOwner, foodController.getFoodsByCategoryId)

foodRouter.route('/addFood')
    .post(isAuthenticatedUser, checkOwner, foodController.addFood)

foodRouter.route('/cafe/:cafeId')
    .get(foodController.getFoodsByCafe)

foodRouter.route('/:foodId')
    .get(isAuthenticatedUser, foodController.getFoodById)
    .put(isAuthenticatedUser, checkOwner, foodController.updateFood)
    .delete(isAuthenticatedUser, checkOwner, foodController.deleteFood)

module.exports = foodRouter