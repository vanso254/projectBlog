const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    hash: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

// Create a User model using the schema
const User = mongoose.model('User', userSchema)

// Export the User model to use it in other parts of your application
module.exports = User
