const express = require('express')
const commentRouter = express.Router();
const commentController = require('../controllers/commentController')
const { isAuthenticatedUser, checkOwner } = require('../middlewares/auth')

commentRouter.route('/cafe/:cafeId')
    .get(commentController.getCommentsByCafeId)
    .post(isAuthenticatedUser, commentController.createComment);

commentRouter.route('/:commentId')
    .delete(isAuthenticatedUser, checkOwner, commentController.deleteComment)

module.exports = commentRouter;