const jwt = require('jsonwebtoken');
const UserToken = require('../models/userToken.js');

exports.generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.deleteOne();
        await UserToken.create({ userId: user._id, token: refreshToken });
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

