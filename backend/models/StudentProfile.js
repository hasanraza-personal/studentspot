const mongoose = require('mongoose');

const StudentProfileSchema = new mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    year: {
        type: String,
    },
    semester: {
        type: String,
    },
    batch: {
        type: String,
    },
    mentorid: {
        type: String,
    },
    mentorname: {
        type: String,
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('studentprofile', StudentProfileSchema);