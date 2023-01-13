const mongoose = require('mongoose');

const Achievementchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    fullname: {
        type: String
    },
    semester: {
        type: String
    },
    competitionname: {
        type: String,
    },
    competitionlevel: {
        type: String,
    },
    competitiondesc: {
        type: String,
    },
    competitioncert: {
        type: String,
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('achievement', Achievementchema);