const Comment = require('../models/comment.js')
const Cafe = require('../models/cafe.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js')
const ErrorHandler = require('../utils/errorHandler.js')
const { createCommentBodyValidation } = require('../utils/validationSchema.js')

exports.getCommentsByCafeId = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }
    const comments = await Comment.find({ cafe: cafe }).populate('user')
    res.status(200).json({
        success: true,
        message: null,
        length: comments.length,
        data: comments
    })
})

exports.createComment = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }

    if (cafe.owner == req.user.id) {
        return next(new ErrorHandler('Cafe employer can not make comment', 400))
    }

    if (cafe.employees.some(employee => employee.user == req.user.id)) {
        return next(new ErrorHandler('Cafe employee can not make comment', 400))
    }

    const { error } = createCommentBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)

    const comment = await Comment.create({
        user: req.user.id,
        cafe: cafe._id,
        message: req.body.message
    })

    res.status(200).json({
        success: true,
        message: "Comment added",
        data: comment
    })
})

exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    const userCafeId = req.user.cafe
    if (!comment) {
        return next(new ErrorHandler('Comment not found', 404))
    }

    if (!comment.cafe.equals(userCafeId)) {
        return next(new ErrorHandler('You have to owner of this cafe to delete this comment', 404))
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json({
        success: true,
        message: `${comment._id} Comment is deleted`,
    })
})
