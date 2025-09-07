const authService = require('../services/authService');

// Handles user login
const login = async (req, res, next) => {
    const { email } = req.body;

    const token = await authService.login(email);

    res.status(200).json({
        status: 'success',
        data: {
            token,
        },
    });
};

module.exports = {
    login,
};