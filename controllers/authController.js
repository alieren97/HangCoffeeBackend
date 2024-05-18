const jwt = require('jsonwebtoken')
const User = require('../models/user')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')
const { generateTokens } = require('../utils/generateToken')
const { signUpBodyValidation, logInBodyValidation, } = require('../utils/validationSchema')

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
    const { error } = signUpBodyValidation(req.body);
    if (error)
        return next(new ErrorHandler(error.details[0].message), 401)

    var user = await User.findOne({ email: req.body.email })
    if (user) {
        return next(new ErrorHandler('User with given email already exist', 400))
    }
    user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    res
        .status(201)
        .json({
            success: true,
            message: "Account created sucessfully"
        });
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { error } = logInBodyValidation(req.body);
    if (error)
        return next(new ErrorHandler(error.details[0].message, 401))

    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid Email or password', 401))
    }

    const isPasswordMatched = await user.comparePassword(req.body.password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('Invalid Email or password', 401))
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
        success: true,
        message: "Logged in sucessfully",
        data: {
            accessToken,
            refreshToken,
            token_type: "Bearer"
        }
    });
})

exports.findByToken = catchAsyncErrors(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new ErrorHandler("Login first to access this resource", 401))
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY)
    const user = await User.findById(decoded._id)
    if (!user)
        return next(new ErrorHandler("User not found", 401))

    res.status(200).json({
        success: true,
        data: { user }
    })
})