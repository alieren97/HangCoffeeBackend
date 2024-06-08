const jwt = require('jsonwebtoken')

const UserToken = require('../models/userToken')
const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const ErrorHandler = require('../utils/errorHandler')

const verifyRefreshToken = require('../utils/verifyRefreshToken')

exports.getNewAccessToken = catchAsyncErrors(async (req, res, next) => {
    const { decoded } = await verifyRefreshToken(req.params.refreshToken)
    const payload = { _id: decoded._id, roles: decoded.roles };

    const accessToken = jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_PRIVATE_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME
        }
    );

    res.status(200).json({
        success: true,
        message: res.__("refresh.refresh_access_token_created_successfully"),
        data: {
            accessToken,
        }
    });
})


exports.logout = catchAsyncErrors(async (req, res, next) => {
    try {
        const userToken = await UserToken.findOne({ token: req.params.refreshToken });
        if (!userToken)
            return res
                .status(200)
                .json({ success: true, message: res.__("refresh.logout_successfully") });

        await userToken.deleteOne();
        res.status(200).json({ success: true, message: res.__("refresh.logout_successfully") });
    } catch (err) {
        return next(new ErrorHandler("system.internal_server_error", 500));
    }
})