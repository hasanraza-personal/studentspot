const express = require('express');
const router = express.Router();
const achievementModel = require('../../models/Achievement');
const profileModel = require('../../models/StudentProfile');
const userModel = require('../../models/User');
const fetchUser = require('../../middleware/fetchuser');
const mongoose = require('mongoose');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const uploadPath = path.join(__dirname, '../../public/images/achievement_certificate');

// Route 1: Get student achievement link using: POST "api/student/achievement/deleteachievement"
router.get('/getachievement', fetchUser, async (req, res) => {
    let achievement = await achievementModel.find({ userid: mongoose.Types.ObjectId(req.user.id) });

    let success = false;
    if (achievement) {
        success = true;
        res.json({ success, achievement });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please refresh the page' });
    }
});

// Route 2: Add student achievement link using: POST "api/student/achievement/addachievement"
router.post('/addachievement', fetchUser, async (req, res) => {
    const imageName = new Date().getTime() + '.jpeg';
    const savePath = path.join(uploadPath, imageName);
    success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (!fields.competitionname) return res.status(400).json({ success, err: 'Please provide a valid competition name' });
        if (!fields.competitionlevel) return res.status(400).json({ success, err: 'Please provide a valid competition level' });
        if (!fields.competitiondesc) return res.status(400).json({ success, err: 'Please provide a valid competition description' });

        if (!files.photo) {
            return res.status(400).json({ success, err: 'Please select the file to upload' });
        }

        let imgTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        // Return -1 of index of array in string not found in array
        if (imgTypes.indexOf(files.photo.mimetype) === -1) {
            return res.status(400).json({ success, err: 'Please upload the file in image of jpeg, jpg or png format' });
        }

        if (files.photo.size > 41943040) {
            return res.status(400).json({ success, err: 'Please upload the file below 40MB' });
        }

        // Save new achievement
        try {
            // Check if user has filled his academic details or not
            let studentProfile = await profileModel.findOne({ userid: mongoose.Types.ObjectId(req.user.id) }).select('_id');
            if (!studentProfile) {
                return res.status(400).json({ success, err: 'Please complete your profile details' });
            }
            
            success = true

            // Fetch user fullname
            let userDetails = await userModel.findById(mongoose.Types.ObjectId(req.user.id)).select('-_id fullname');
            // Fetch user semester
            let academicDetails = await profileModel.findOne({ userid: mongoose.Types.ObjectId(req.user.id) }).select('-_id semester');

            let newAchievement = await achievementModel.create({
                userid: mongoose.Types.ObjectId(mongoose.Types.ObjectId(req.user.id)),
                fullname: userDetails.fullname,
                semester: academicDetails.semester,
                competitionname: fields.competitionname,
                competitionlevel: fields.competitionlevel,
                competitiondesc: fields.competitiondesc,
                competitioncert: imageName
            });

            // Upload image in folder 
            sharp(files.photo.filepath).jpeg({
                quality: 70
            }).toFile(savePath, (error, info) => {
                if (error) {
                    return res.status(400).json({ success, err: 'Something went wrong during compression. Please try again' });
                }
            });

            res.json({ success, msg: 'Your achievement has been added', newAchievement });
        } catch (error) {
            return res.status(400).json({ success, err: 'Something went wrong while saving. Please try again' });
        }
    });
})

// Route 3: Update student achievement link using: POST "api/student/achievement/updateachievement"
router.post('/updateachievement', fetchUser, async (req, res) => {
    const imageName = new Date().getTime() + '.jpeg';
    const savePath = path.join(uploadPath, imageName);
    success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        let { competitionid, competitionname, competitionlevel, competitiondesc } = fields;

        let updatedAchievement = {};
        if (competitionname) { updatedAchievement.competitionname = competitionname };
        if (competitionlevel) { updatedAchievement.competitionlevel = competitionlevel };
        if (competitiondesc) { updatedAchievement.competitiondesc = competitiondesc };

        // If file is present
        if (files.photo) {
            let imgTypes = ['image/jpeg', 'image/jpg', 'image/png'];
            // Return -1 of index of array in string not found in array
            if (imgTypes.indexOf(files.photo.mimetype) === -1) {
                return res.status(400).json({ success, err: 'Please upload the file in image of jpeg, jpg or png format' });
            }

            if (files.photo.size > 41943040) {
                return res.status(400).json({ success, err: 'Please upload the file below 40MB' });
            }
            updatedAchievement.competitioncert = imageName;

            try {
                // Fetch previous image and delete it from folder
                let image = await achievementModel.findById(mongoose.Types.ObjectId(competitionid)).select('-_id competitioncert');

                let previousImage = `${uploadPath}/${image.competitioncert}`;
                if (fs.existsSync(previousImage)) {
                    fs.unlinkSync(previousImage)
                }
            } catch (error) {
                return res.status(400).json({ success, err: 'Something went wrong. Please try again' });
            }
        }

        // Update achievement
        try {
            success = true;
            let newAchievement = await achievementModel.findByIdAndUpdate(mongoose.Types.ObjectId(competitionid), { $set: updatedAchievement }, { new: true });

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

            res.json({ success, msg: 'Your achievement has been updated', newAchievement });
        } catch (error) {
            return res.status(400).json({ success, err: 'Something went wrong while saving. Please try again' });
        }
    });
});


// Route 4: Delete student achievement link using: POST "api/student/achievement/deleteachievement"
router.post('/deleteachievement', async (req, res) => {
    let achievementData = await achievementModel.findById(mongoose.Types.ObjectId(req.body.id)).select('-_id competitioncert')

    let AchievementCert = `${uploadPath}/${achievementData.competitioncert}`;
    if (fs.existsSync(AchievementCert)) {
        fs.unlinkSync(AchievementCert)
    }
    let achievement = await achievementModel.findByIdAndDelete(mongoose.Types.ObjectId(req.body.id));

    let success = false;
    if (achievement) {
        success = true;
        res.json({ success, msg: 'Your achievement has been deleted', achievement });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please try again', achievement });
    }
});

module.exports = router;