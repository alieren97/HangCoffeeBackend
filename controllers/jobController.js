const User = require('../models/user')
const Cafe = require('../models/cafe')
const Job = require('../models/job')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { createJobOppurtunityBodyValidation, updateJobOppurtunityBodyValidation } = require('../utils/validationSchema.js')


exports.createJobOppurtionty = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }

    const { error } = createJobOppurtunityBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)

    await Job.create({ cafe: cafe._id, position: req.body.position, job_type: req.body.job_type, experience_type: req.body.experience_type, createdBy: req.user._id })

    res.status(200).json({
        success: true,
        message: res.__('job.job_oppurtunity_created_successfully'),
    })
})

exports.getJobs = catchAsyncErrors(async (req, res, next) => {
    const jobs = await Job.find()

    res.status(200).json({
        success: true,
        message: null,
        length: jobs.length,
        data: jobs
    })
})

exports.getJobsByCafe = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.params.cafeId)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }

    const jobs = await Job.find({ cafe: cafe._id })
    res.status(200).json({
        success: true,
        message: null,
        length: jobs.length,
        data: jobs
    })
})

exports.updateJob = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)
    if (!cafe) {
        return next(new ErrorHandler('cafe.cafe_not_found', 404))
    }
    const job = await Job.findOne({ _id: req.params.jobId, createdBy: req.user._id })
    if (!job) {
        return next(new ErrorHandler('job.job_not_created_by_you_or_found', 404))
    }

    const { error } = updateJobOppurtunityBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)

    await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    res.status(200).json({
        success: true,
        message: res.__("job.job_oppurtunity_updated_successfully"),
    })
})


exports.getJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.findById(req.params.jobId)
    if (!job) {
        return next(new ErrorHandler('job.job_not_found', 404))
    }
    res.status(200).json({
        success: true,
        message: null,
        data: job
    })
})

exports.applyJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.findById(req.params.jobId)
    if (!job) {
        return next(new ErrorHandler('job.job_not_found', 404))
    }

    const userId = req.body.userId

    await Job.findByIdAndUpdate(req.params.jobId, { $push: { appliedBy: userId } }, { new: true })
    res.status(200).json({
        success: true,
        message: res.__("job.congrats_you_applied"),
    })
})

exports.deleteJob = catchAsyncErrors(async (req, res, next) => {
    await Job.findByIdAndDelete(req.params.jobId)
    res.status(200).json({
        success: true,
        message: res.__("job.job_oppurtunity_deleted_successfully"),
    })
})

