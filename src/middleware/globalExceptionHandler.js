
const AppError = require('../utils/AppError');

// Handles Mongoose validation errors
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError(message, 400);
};

// Handles Mongoose duplicate field errors
const handleDuplicateFieldsDB = (err) => {
    const value = err.errmsg.match(/(?<=")(?:.)*?(?=")/)[0];
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError(message, 400);
};

// Global error handler for all uncaught exceptions
const globalExceptionHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    });
};

module.exports = globalExceptionHandler;
