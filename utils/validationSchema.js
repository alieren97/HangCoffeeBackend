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

exports.createCafeBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        image: Joi.array().required(),
        cafe_type: Joi.string().valid('Cafe', 'Cafe+Restaurant', 'Restaurant', 'Pub', 'Pub+Restaurant').required(),
        working_hours: Joi.string().required(),
        address: Joi.string().min(10).max(100).required(),
        about: Joi.string().min(20).max(150).required(),
        owner: Joi.string().min(5).max(50).required()
    })

    return schema.validate(body)
}

exports.updateCafeBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30),
        image: Joi.array(),
        cafe_type: Joi.string().valid('Cafe', 'Cafe+Restaurant', 'Restaurant', 'Pub', 'Pub+Restaurant'),
        working_hours: Joi.string(),
        address: Joi.string().min(10).max(100),
        about: Joi.string().min(20).max(150),
        owner: Joi.string().min(5).max(50)
    })

    return schema.validate(body)
}