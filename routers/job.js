const express = require('express')
const jobRouter = express.Router()
const jobController = require('../controllers/jobController')
const { isAuthenticatedUser, authorizeRoles, checkOwner } = require('../middlewares/auth')

jobRouter.route('/')
    .get(isAuthenticatedUser, jobController.getJobs)

jobRouter.route('/cafe/:cafeId')
    .get(isAuthenticatedUser, jobController.getJobsByCafe)

jobRouter.route('/createJob')
    .post(isAuthenticatedUser, authorizeRoles('employer', 'admin', 'super admin'), jobController.createJobOppurtionty)

jobRouter.route('/apply/:jobId')
    .put(isAuthenticatedUser, authorizeRoles('user', 'employee'), jobController.applyJob)

jobRouter.route('/:jobId')
    .get(isAuthenticatedUser, jobController.getJob)
    .put(isAuthenticatedUser, checkOwner, jobController.updateJob)
    .delete(isAuthenticatedUser, checkOwner, jobController.deleteJob)

module.exports = jobRouter