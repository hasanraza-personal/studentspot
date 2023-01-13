const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'default_profile_photo.png'
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema);