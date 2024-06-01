const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Cafe = require('../models/cafe')
const Comment = require('../models/comment')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

//Check if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorHandler("Login first to access this resource"), 401)
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY)
    req.user = await User.findById(decoded._id)

    next()
})

// handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.some(r => req.user.role.includes(r))) {
            return next(new ErrorHandler(`Role(${req.user.role}) is not allowed to access this resource.`, 403))
        }
        next();
    }
}

// Check owner of that cafe so it can be updated or deleted.
exports.checkOwner = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (cafe.owner != req.user.id) {
        return next(new ErrorHandler('You have to be the owner of this cafe', 403))
    }
    next()
})

exports.checkOwnerForComment = catchAsyncErrors(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    const cafe = await Cafe.findById(comment.cafe)
    if (cafe.owner != req.user.id) {
        return next(new ErrorHandler('You have to be the owner of this cafe', 403))
    }
    next()
})