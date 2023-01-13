const mongoose = require('mongoose');

const Newsletterschema = new mongoose.Schema({
    title: {
        type: String,
    },
    desc: {
        type: String,
    },
    photo: {
        type: String,
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('newsletter', Newsletterschema);