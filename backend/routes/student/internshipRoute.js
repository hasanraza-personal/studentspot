const express = require('express');
const router = express.Router();
const internshipModel = require('../../models/Internship');
const profileModel = require('../../models/StudentProfile');
const userModel = require('../../models/User');
const fetchUser = require('../../middleware/fetchuser');
const mongoose = require('mongoose');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const uploadPath = path.join(__dirname, '../../public/images/internship_certificate');

// Route 1: Get student internship link using: POST "api/student/internship/getinternship"
router.get('/getinternship', fetchUser, async (req, res) => {
    let internship = await internshipModel.find({userid: mongoose.Types.ObjectId(req.user.id)});

    let success = false;
    if (internship) {
        success = true;
        res.json({ success, internship });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please refresh the page' });
    }
});

// Route 2: Add student internship link using: POST "api/student/achievement/addinternship"
router.post('/addinternship', fetchUser, async (req, res) => {
    const imageName = new Date().getTime() + '.jpeg';
    const savePath = path.join(uploadPath, imageName);
    success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (!fields.companyname) return res.status(400).json({ success, err: 'Please provide a valid company name' });
        if (!fields.workduration) return res.status(400).json({ success, err: 'Please provide a valid work duration level' });
        if (!fields.stipends) return res.status(400).json({ success, err: 'Please provide a valid stipends' });
        if (!fields.languages) return res.status(400).json({ success, err: 'Please provide a valid progamming language' });
        if (!fields.workdesc) return res.status(400).json({ success, err: 'Please provide a valid work description' });

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

        // Save new internship
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

            let newInternship = await internshipModel.create({
                userid: mongoose.Types.ObjectId(mongoose.Types.ObjectId(req.user.id)),
                fullname: userDetails.fullname,
                semester: academicDetails.semester,
                companyname: fields.companyname,
                workduration: fields.workduration,
                stipends: fields.stipends,
                languages: fields.languages,
                workdesc: fields.workdesc,
                internshipcert: imageName,
            });

            // Upload image in folder 
            sharp(files.photo.filepath).jpeg({
                quality: 70
            }).toFile(savePath, (error, info) => {
                if (error) {
                    return res.status(400).json({ success, err: 'Something went wrong during compression. Please try again' });
                }
            });

            res.json({ success, msg: 'Your internship has been added', newInternship });
        } catch (error) {
            return res.status(400).json({ success, err: 'Something went wrong while saving. Please try again' });
        }
    });
})

// Route 3: Update student internship link using: POST "api/student/internship/updateinternship"
router.post('/updateinternship', fetchUser, async (req, res) => {
    const imageName = new Date().getTime() + '.jpeg';
    const savePath = path.join(uploadPath, imageName);
    success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        let { internshipid, companyname, workduration, stipends, languages, workdesc } = fields;

        let updatedInternship = {};
        if (companyname) { updatedInternship.companyname = companyname };
        if (workduration) { updatedInternship.workduration = workduration };
        if (stipends) { updatedInternship.stipends = stipends };
        if (languages) { updatedInternship.languages = languages };
        if (workdesc) { updatedInternship.workdesc = workdesc };

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
            updatedInternship.internshipcert = imageName;

            try {
                // Fetch previous image and delete it from folder
                let image = await internshipModel.findById(mongoose.Types.ObjectId(internshipid)).select('-_id internshipcert');

                let previousImage = `${uploadPath}/${image.internshipcert}`;
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
            let newInternship = await internshipModel.findByIdAndUpdate(mongoose.Types.ObjectId(internshipid), { $set: updatedInternship }, { new: true });

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

            res.json({ success, msg: 'Your internship has been updated', newInternship });
        } catch (error) {
            return res.status(400).json({ success, err: 'Something went wrong while saving. Please try again' });
        }
    });
});


// Route 4: Delete student internship link using: POST "api/student/internship/deleteinternship"
router.post('/deleteinternship', async (req, res) => {
    let internshipData = await internshipModel.findById(mongoose.Types.ObjectId(req.body.internshipid)).select('-_id internshipcert')
    
    let InternshipCert = `${uploadPath}/${internshipData.internshipcert}`;
    if (fs.existsSync(InternshipCert)) {
        fs.unlinkSync(InternshipCert)
    }
    let internship = await internshipModel.findByIdAndDelete(mongoose.Types.ObjectId(req.body.internshipid));

    let success = false;
    if (internship) {
        success = true;
        res.json({ success, msg: 'Your internship has been deleted', internship });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please try again', internship });
    }
});

module.exports = router;