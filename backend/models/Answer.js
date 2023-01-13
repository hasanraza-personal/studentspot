const mongoose = require('mongoose');

const Answerschema = new mongoose.Schema({
    questionid: {
        type: mongoose.Schema.Types.ObjectId,
    },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
    },
    fullname: {
        type: String
    },
    photo: {
        type: String
    },
    answer: {
        type: String
    },
    verified: {
        type: Number
    },
    verifierid: {
        type: mongoose.Schema.Types.ObjectId
    },
    verifierfullname: {
        type: String
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('answer', Answerschema);