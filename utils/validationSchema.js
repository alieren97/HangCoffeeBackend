const Joi = require('joi')

exports.signUpBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(30).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required()
    });
    return schema.validate(body);
};

exports.logInBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().min(6).max(30).required().label("Password"),
    });
    return schema.validate(body);
};

exports.refreshTokenBodyValidation = Joi.object({
    refreshToken: Joi.string().required(),
});
