const mongoose = require('mongoose');

const Projectschema = new mongoose.Schema({
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
    projectname: {
        type: String,
    },
    projectlang: {
        type: String,
    },
    projectdesc: {
        type: String,
    },
    projectfile: {
        type: String,
    },
    createdat: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('project', Projectschema);