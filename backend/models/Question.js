const mongoose = require('mongoose');

const Questionschema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId
    },
    fullname: {
        type: String
    },
    photo: {
        type: String
    },
    question: {
        type: String,
    },
    answer: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'answer'
        }
    ],
    createdat: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('question', Questionschema);