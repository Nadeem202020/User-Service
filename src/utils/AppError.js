// Represents a custom error that can be thrown in the application
class AppError extends Error {
    // Creates a new instance of the AppError class
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.status = String(statusCode).startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;