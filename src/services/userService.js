const User = require('../models/user.model');
const AppError = require('../utils/AppError');

// Creates a new user, ensuring the email is unique
const createUser = async (userData) => {
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw new AppError('An account with this email already exists.', 409);
    }

    const user = new User(userData);
    return await user.save();
};

// Fetches a paginated list of users, with an optional age filter
const getAllUsers = async (options) => {
    const { page, size, age } = options;

    const filterQuery = {};
    if (age) {
        filterQuery.age = age;
    }

    const users = await User.find(filterQuery)
        .limit(size)
        .skip(page * size)
        .select('-__v');

    return users;
};

// Fetches a single user by their ID
const getUserById = async (id) => {
    const user = await User.findById(id);
    if (!user) {
        throw new AppError(`No user found with ID: ${id}`, 404);
    }
    return user;
};

// Updates an existing user's information
const updateUser = async (id, updateData) => {
    if (updateData.email) {
        const emailExists = await User.findOne({
            email: updateData.email,
            _id: { $ne: id },
        });
        if (emailExists) {
            throw new AppError('This email is already in use by another account.', 409);
        }
    }

    const user = await User.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        throw new AppError(`No user found with ID: ${id} to update.`, 404);
    }

    return user;
};

// Deletes a user by their ID
const deleteUser = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
        throw new AppError(`No user found with ID: ${id} to delete.`, 404);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};