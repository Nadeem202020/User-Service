const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const AppError = require('../utils/AppError');

// Middleware for authenticating users with JWT
const authMiddleware = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Access denied. No token provided.', 401));
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new AppError('The user belonging to this token no longer exists.', 401));
        }

        req.user = user;
        next();
    } catch (error) {
        return next(new AppError('Invalid or expired token.', 401));
    }
};

module.exports = authMiddleware;