
const User = require('../models/user.model');

// Initializes the database with an admin user if no users exist
const initialize = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log('No users found, creating admin user');
            await new User({
                name: 'Admin User',
                email: 'admin@example.com',
                age: 99,
            }).save();
        }
    } catch (error) {
        console.error('Error initializing data:', error);
    }
};

module.exports = { initialize };
