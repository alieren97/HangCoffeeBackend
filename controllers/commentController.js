const Comment = require('../models/comment.js')
const Cafe = require('../models/cafe.js')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors.js')
const ErrorHandler = require('../utils/errorHandler.js')
const { createCommentBodyValidation } = require('../utils/validationSchema.js')
const i18n = require('i18n')

exports.getCommentsByCafeId = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found_error', 404))
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
        return next(new ErrorHandler('cafe.cafe_not_found_error', 404))
    }

    if (cafe.owner == req.user.id) {
        return next(new ErrorHandler('comment.comment_employer_cant_make_comment_to_working_cafe', 400))
    }

    if (cafe.employees.some(employee => employee.user == req.user.id)) {
        return next(new ErrorHandler('comment.comment_employee_cant_make_comment_to_working_cafe', 400))
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
        message: "comment.comment_added_successfully",
        data: comment
    })
})

exports.deleteComment = catchAsyncErrors(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId)
    const userCafeId = req.user.cafe
    if (!comment) {
        return next(new ErrorHandler('comment.comment_not_found', 404))
    }

    if (!comment.cafe.equals(userCafeId)) {
        return next(new ErrorHandler('comment.comment_delete_have_to_be_owner_this_cafe', 404))
    }
    await Comment.findByIdAndDelete(req.params.commentId)
    res.status(200).json({
        success: true,
        message: i18n('comment.comment_deleted_successfully', { comment: comment.message }),
    })
})
