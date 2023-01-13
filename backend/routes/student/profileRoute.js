const express = require('express');
const router = express.Router();
const studentprofileModel = require('../../models/StudentProfile');
const fetchUser = require('../../middleware/fetchuser');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

// Route 1: Update student profile details link using: POST "api/student/updatebasicdetails"
router.post('/updatebasicdetails', fetchUser, [
    body('year', 'Enter a valid year').exists(),
    body('semester', 'Enter a valid semester').exists(),
], async (req, res) => {
    let success = false

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.errors[0].msg });
    }

    let {userid, year, semester, batch, mentorname} = req.body;
    success = true;

    // Check if basic details of student exist or not
    let basicProfile = await studentprofileModel.findOne({userid: mongoose.Types.ObjectId(req.user.id)});
    if(!basicProfile){
        // Insert basic details
        let newbasicDetails = new studentprofileModel({
            userid: mongoose.Types.ObjectId(req.user.id),
            year, semester, batch, mentorname
        });
        await newbasicDetails.save();
        res.json({ success, msg: 'Your basic profile details has been saved'});
    }else{
        // update basic details
        let updateBasicDetails = {
            batch, mentorname
        }
        if(year){updateBasicDetails.year = year};
        if(semester){updateBasicDetails.semester = semester};

        await studentprofileModel.findOneAndUpdate({userid: mongoose.Types.ObjectId(req.user.id)}, { $set: updateBasicDetails })
        res.json({ success, msg: 'Your basic profile details has been updated'});
    }
});

// Route 3: Get student basic details link using: GET "api/student/getbasicdetails"
router.get('/getbasicdetails', fetchUser, async (req, res) => {
    let user = await studentprofileModel.findOne({userid: mongoose.Types.ObjectId(req.user.id)}).select('-_id -createdat -userid')
    res.json(user);
})

module.exports = router;