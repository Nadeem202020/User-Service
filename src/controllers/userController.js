const userService = require('../services/userService');

// Handles the creation of a new user
const createUser = async (req, res, next) => {
    const user = await userService.createUser(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user,
        },
    });
};

// Fetches all users with pagination and optional age filtering
const getAllUsers = async (req, res, next) => {
    const page = parseInt(req.query.page, 10) || 0;
    const size = parseInt(req.query.size, 10) || 10;
    const age = req.query.age ? parseInt(req.query.age, 10) : null;

    const users = await userService.getAllUsers({ page, size, age });

    res.status(200).json({
        status: 'success',
        results: users.length,
        data: {
            users,
        },
    });
};

// Fetches a single user by their ID
const getUserById = async (req, res, next) => {
    const user = await userService.getUserById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
};

// Updates an existing user
const updateUser = async (req, res, next) => {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
};

// Deletes a user
const deleteUser = async (req, res, next) => {
    await userService.deleteUser(req.params.id);
    res.status(200).json({
        status: 'success',
        message: `User with ID ${req.params.id} has been deleted successfully.`,
    });
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};