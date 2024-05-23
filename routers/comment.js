const express = require('express')
const commentRouter = express.Router();
const commentController = require('../controllers/commentController')
const { isAuthenticatedUser, authorizeRoles, checkOwner } = require('../middlewares/auth')

commentRouter.route('/:cafeId')
    .get(commentController.getCommentsByCafeId)
    .post(isAuthenticatedUser, commentController.createComment);

commentRouter.route('/:commentId')
    .delete(isAuthenticatedUser, checkOwner, authorizeRoles('employeer', 'admin'), commentController.deleteComment)

module.exports = commentRouter;