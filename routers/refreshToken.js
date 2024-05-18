const express = require('express')
const refreshRouter = express.Router()
const validator = require('express-joi-validation').createValidator({ passError: true })

const refreshTokenController = require('../controllers/refreshTokenController')
const { refreshTokenBodyValidation } = require('../utils/validationSchema')

refreshRouter.route('/:refreshToken')
    .post(validator.params(refreshTokenBodyValidation), refreshTokenController.getNewAccessToken)
    .delete(validator.params(refreshTokenBodyValidation), refreshTokenController.logout)

module.exports = refreshRouter