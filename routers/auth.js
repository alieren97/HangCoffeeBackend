const express = require('express')
const authRouter = express.Router()
const authController = require('../controllers/authController')
const { isAuthenticatedUser } = require('../middlewares/auth')

authRouter.route('/register').post(authController.registerUser)
authRouter.route('/login').post(authController.loginUser)
authRouter.route('/me').get(isAuthenticatedUser, authController.findByToken)

module.exports = authRouter