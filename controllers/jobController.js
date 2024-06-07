const User = require('../models/user')
const Cafe = require('../models/cafe')
const Job = require('../models/job')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { createJobOppurtunityBodyValidation, updateJobOppurtunityBodyValidation } = require('../utils/validationSchema.js')


exports.createJobOppurtionty = catchAsyncErrors(async (req, res, next) => {
    const cafe = await Cafe.findById(req.user.cafe)
    if (!cafe) {
        return next(new ErrorHandler('Cafe not found', 404))
    }

    const { error } = createJobOppurtunityBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)

    await Job.create({ cafe: cafe._id, position: req.body.position, job_type: req.body.job_type, experience_type: req.body.experience_type, createdBy: req.user._id })

    res.status(200).json({
        success: true,
        message: "Job Oppurtunity Created Successfully",
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
        return next(new ErrorHandler('Cafe not found', 404))
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
        return next(new ErrorHandler('Cafe not found', 404))
    }
    const job = await Job.findOne({ _id: req.params.jobId, createdBy: req.user._id })
    if (!job) {
        return next(new ErrorHandler('Job not found or it is not created by you', 404))
    }

    const { error } = updateJobOppurtunityBodyValidation(req.body)
    if (error)
        return next(new ErrorHandler(error.details[0].message), 400)

    await Job.findByIdAndUpdate(req.params.jobId, req.body, { new: true })
    res.status(200).json({
        success: true,
        message: "Job oppurtunity updated successfully",
    })
})


exports.getJob = catchAsyncErrors(async (req, res, next) => {
    const job = await Job.findById(req.params.jobId)
    if (!job) {
        return next(new ErrorHandler('Job not found', 404))
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
        return next(new ErrorHandler('Job not found', 404))
    }

    const userId = req.body.userId

    await Job.findByIdAndUpdate(req.params.jobId, { $push: { appliedBy: userId } }, { new: true })
    res.status(200).json({
        success: true,
        message: "Congrats, You applied to the job...",
    })
})

