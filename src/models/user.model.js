const mongoose = require('mongoose');

// Defines the schema for the User model
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A user must have a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'A user must have an email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        age: {
            type: Number,
            index: true, // Index for faster queries
        },
    },
    {
        timestamps: true, // Automatically add createdAt and updatedAt fields
    }
);

module.exports = mongoose.model('User', userSchema);