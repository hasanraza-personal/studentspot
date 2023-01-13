const mongoose = require('mongoose');

const Internshipschema = new mongoose.Schema({
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
    companyname: {
        type: String,
    },
    workduration: {
        type: String,
    },
    stipends: {
        type: String,
    },
    languages: {
        type: String,
    },
    workdesc: {
        type: String,
    },
    internshipcert: {
        type: String,
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('internship', Internshipschema);