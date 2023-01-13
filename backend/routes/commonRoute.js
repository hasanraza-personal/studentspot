const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const fetchUser = require('../middleware/fetchuser');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const formidable = require('formidable');
const questionModel = require('../models/Question');
const answerModel = require('../models/Answer');

const uploadPath = path.join(__dirname, '../public/images/profile_picture');

// Route 1: Update profile photo link using: POST "api/common/updateprofilephoto"
router.post('/updateprofilephoto', fetchUser, async (req, res) => {
    let newPhoto = new Date().getTime() + '.jpeg';
    const savePath = path.join(uploadPath, newPhoto);
    success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
        if (!files.photo) {
            return res.status(400).json({ success, error: 'Please select the file to upload' });
        }

        let imgTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        // Return -1 of index of array in string not found in array
        if (imgTypes.indexOf(files.photo.mimetype) === -1) {
            return res.status(400).json({ success, error: 'Please upload the file in image of jpeg, jpg or png format' });
        }

        if (files.photo.size > 41943040) {
            return res.status(400).json({ success, error: 'Please upload the file below 40MB' });
        }

        try {
            // Fetch previous profile photo and delete it from folder
            let profilePhoto = await userModel.findById(mongoose.Types.ObjectId(req.user.id)).select('-_id photo');
            if (profilePhoto.photo !== 'default_profile_photo.png') {
                let oldProfilePhoto = path.join(uploadPath, profilePhoto.photo);
                if (fs.existsSync(oldProfilePhoto)) {
                    fs.unlinkSync(oldProfilePhoto)
                }
            }
        } catch (err) {
            return res.status(400).json({ success, error: 'Something went wrong while deleting the previous photo. Please try again' });
        }

        try {
            // Update photo in database and folder
            success = true;

            await userModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.user.id), { photo: newPhoto }, { new: true });
            await questionModel.updateMany({ userid: mongoose.Types.ObjectId(req.user.id) }, { photo: newPhoto }, { new: true });
            await answerModel.updateMany({ userid: mongoose.Types.ObjectId(req.user.id) }, { photo: newPhoto }, { new: true });

            // Upload image in folder 
            if (files.photo) {
                sharp(files.photo.filepath).jpeg({
                    quality: 70
                }).toFile(savePath, (error, info) => {
                    if (error) {
                        return res.status(400).json({ success, err: 'Something went wrong during compression. Please try again' });
                    }
                });
            }
            res.json({ success, msg: 'Your profile photo has been updated' });
        } catch (err) {
            return res.status(400).json({ success, error: 'Something went wrong while saving the photo. Please try again' });
        }
    })
});

// Route 2: Update profile details link using: POST "api/common/updateprofiledetails"
router.post('/updateprofiledetails', fetchUser, [
    body('email', 'Enter a valid email').isEmail(),
    body('username', 'Enter a valid username').isLength({ min: 3 }),
    body('fullname', 'Enter a valid name').isLength({ min: 5 }),
    body('gender', 'Provide your gender').exists(),
], async (req, res) => {
    let success = false
    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.errors[0].msg });
    }

    // Check whether the user with this email exists already
    let useremail = await userModel.findOne({ email: req.body.email });
    if (useremail) {
        if (useremail._id.toString() !== req.user.id) {
            return res.status(400).json({ success, error: 'Sorry a user with same email already exist' });
        }
    }

    // Check whether the user with this username exists already
    let user = await userModel.findOne({ username: req.body.username });
    if (user) {
        if (user._id.toString() !== req.user.id) {
            console.log('Username Exist');
            return res.status(400).json({ success, error: 'Sorry a user with same username already exist' });
        }
    }

    let { email, username, fullname, gender } = req.body

    let updatedProfile = {};
    if (email) { updatedProfile.email = email };
    if (username) { updatedProfile.username = username };
    if (fullname) { updatedProfile.fullname = fullname };
    if (gender) { updatedProfile.gender = gender };

    success = true;
    await userModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.user.id), { $set: updatedProfile });
    await questionModel.updateMany({ userid: mongoose.Types.ObjectId(req.user.id) }, { fullname });
    await answerModel.updateMany({ userid: mongoose.Types.ObjectId(req.user.id) }, { fullname });
    
    res.json({ success, msg: 'Your profile has been updated' });
});

// Route 3: Update account password link using: POST "api/common/updatepassword"
router.post('/updatepassword', fetchUser, [
    body('oldpassword', 'Old password cannot be black').exists(),
    body('newpassword', 'Password must be atleast 5 characters').isLength({ min: 5 }),
    body('confirmpassword', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.errors[0].msg });
    }

    // Check whether the user with this email exists or not and fetch password
    let user = await userModel.findById(mongoose.Types.ObjectId(req.user.id));
    if (!user) {
        return res.status(400).json({ success, error: 'Access Denied' });
    }

    passwordCompare = await bcrypt.compare(req.body.oldpassword, user.password);
    if (!passwordCompare) {
        return res.status(400).json({ success, error: "Please enter correct password for this account" });
    }

    if (req.body.newpassword !== req.body.confirmpassword) {
        return res.status(400).json({ success, error: 'New password and confirm password not matched' });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.newpassword, salt);

    success = true;
    await userModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.user.id), { $set: { password: secPass } })
    res.json({ success, msg: 'Your password has been changed.' });
});

// Route 3: Get user account details link using: GET "api/common/getuserdetails"
router.get('/getuserdetails', fetchUser, async (req, res) => {
    let user = await userModel.findById(mongoose.Types.ObjectId(req.user.id)).select('-_id -createdat -password')
    res.json(user);
})

// Route 4: Get user id link using: GET "api/common/getuserid"
router.get('/getuserid', fetchUser, async (req, res) => {
    let user = await userModel.findById(mongoose.Types.ObjectId(req.user.id)).select('_id designation')
    res.json(user);
})

module.exports = router;