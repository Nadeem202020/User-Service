const Joi = require('joi');
const AppError = require('../utils/AppError');

// Schema for validating user creation requests
const createUserSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    age: Joi.number(),
});

// Middleware for validating request bodies against a schema
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        const message = error.details.map((i) => i.message).join(', ');
        return next(new AppError(message, 400));
    }
    next();
};

module.exports = {
    validate,
    createUserSchema,
};