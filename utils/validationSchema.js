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

exports.createTableBodyValidation = (body) => {
    const schema = Joi.object({
        tableName: Joi.string().min(3).max(30).required(),
        quota: Joi.number().required(),
        tableInfo: Joi.string().min(5).max(50).required()
    })

    return schema.validate(body)
}

exports.createCommentBodyValidation = (body) => {
    const schema = Joi.object({
        message: Joi.string().min(3).max(100).required()
    })

    return schema.validate(body)
}

exports.createFoodCategoryBodyValidation = (body) => {
    const schema = Joi.object({
        categoryName: Joi.string().min(3).max(50).required(),
        categoryImage: Joi.string().min(3).max(200).required()
    })

    return schema.validate(body)
}

exports.createFoodBodyValidation = (body) => {
    const schema = Joi.object({
        foodImage: Joi.string().min(3).max(200).required(),
        foodName: Joi.string().min(3).max(50).required(),
        price: Joi.number().required(),
        foodCategory: Joi.string().required()
    })

    return schema.validate(body)
}

exports.updateTableBodyValidation = (body) => {
    const schema = Joi.object({
        tableName: Joi.string().min(3).max(30),
        quota: Joi.number(),
        tableInfo: Joi.string().min(5).max(50)
    })

    return schema.validate(body)
}

exports.createJobOppurtunityBodyValidation = (body) => {
    const schema = Joi.object({
        position: Joi.string().valid('Barista', 'Service', 'Chef', 'Manager').required(),
        job_type: Joi.string().valid('Full-Time', 'Part-Time').required(),
        experience_type: Joi.string().valid('0-1 year', '2 years', '2+ years').required()
    })

    return schema.validate(body)
}

exports.updateJobOppurtunityBodyValidation = (body) => {
    const schema = Joi.object({
        position: Joi.string().valid('Barista', 'Service', 'Chef', 'Manager'),
        job_type: Joi.string().valid('Full-Time', 'Part-Time'),
        experience_type: Joi.string().valid('0-1 year', '2 years', '2+ years')
    })

    return schema.validate(body)
}