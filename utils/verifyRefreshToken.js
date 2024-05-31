const jwt = require('jsonwebtoken');
const UserToken = require('../models/userToken.js');

const verifyRefreshToken = async (refreshToken) => {
    try {
        const userToken = await UserToken.findOne({ token: refreshToken });
        if (!userToken)
            return Promise.reject({ error: true, message: "Invalid refresh token" });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY)
        if (!decoded)
            return Promise.reject({ error: true, message: "Invalid refresh token" });
        return Promise.resolve({ decoded });
    } catch (error) {
        return Promise.reject({ error });
    }
};

module.exports = verifyRefreshToken
