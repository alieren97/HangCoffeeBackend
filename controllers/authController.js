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
        return next(new ErrorHandler('register.register_email_already_exist', 400))
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
            message: res.__("register.register_success")
        });
})

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { error } = logInBodyValidation(req.body);
    if (error)
        return next(new ErrorHandler(error.details[0].message, 401))

    const user = await User.findOne({ email: req.body.email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('login.login_invalid_email_or_password', 401))
    }

    const isPasswordMatched = await user.comparePassword(req.body.password)
    if (!isPasswordMatched) {
        return next(new ErrorHandler('login.login_invalid_email_or_password', 401))
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    res.status(200).json({
        success: true,
        message: res.__("login.login_success"),
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
        return next(new ErrorHandler("me.me_login_first_error", 401))
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY)
    const user = await User.findById(decoded._id)
    if (!user)
        return next(new ErrorHandler("user.user_not_found_error", 401))

    res.status(200).json({
        success: true,
        message: null,
        data: user
    })
})