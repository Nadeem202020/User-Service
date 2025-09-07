const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');

// Authenticates a user and generates a JWT
const login = async (email) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new AppError('Incorrect email or password.', 401);
    }

    const payload = { id: user._id };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    });

    return token;
};

module.exports = {
    login,
};