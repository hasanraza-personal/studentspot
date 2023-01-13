const express = require('express');
const router = express.Router();
const projectModel = require('../../models/Project');
const profileModel = require('../../models/StudentProfile');
const userModel = require('../../models/User');
const fetchUser = require('../../middleware/fetchuser');
const mongoose = require('mongoose');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const uploadPath = path.join(__dirname, '../../public/project_file');

// Route 1: Get student all project link using: POST "api/student/project/getallproject"
router.get('/getallproject', async (req, res) => {
    let project = await projectModel.find();
    console.log(project)
    let success = false;
    if (project) {
        success = true;
        res.json({ success, project });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please refresh the page' });
    }
});

// Route 1: Get student project link using: POST "api/student/project/getproject"
router.get('/getproject', fetchUser, async (req, res) => {
    let project = await projectModel.find({userid: mongoose.Types.ObjectId(req.user.id)});
    let success = false;
    if (project) {
        success = true;
        res.json({ success, project });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please refresh the page' });
    }
});

// Route 2: Add student project link using: POST "api/student/project/addproject"
router.post('/addproject', fetchUser, async (req, res) => {
    let ext;
    let success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (!fields.projectname) return res.status(400).json({ success, err: 'Please provide a valid project name' });
        if (!fields.projectlang) return res.status(400).json({ success, err: 'Please provide a valid programming language' });
        if (!fields.projectdesc) return res.status(400).json({ success, err: 'Please provide a valid project description' });

        if (!files.filename) {
            return res.status(400).json({ success, err: 'Please select the file to upload' });
        }

        let imgTypes = ['application/x-7z-compressed', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
        // Return -1 of index of array in string not found in array
        if (imgTypes.indexOf(files.filename.mimetype) === -1) {
            console.log('files.filename.mimetype: ', files.filename.mimetype);
            return res.status(400).json({ success, err: 'Please upload the file in .zip format' });
        }

        if (files.filename.size > 41943040) {
            return res.status(400).json({ success, err: 'Please upload the file below 40MB' });
        }

        if (files.filename.mimetype === 'application/x-7z-compressed' || files.filename.mimetype === 'application/octet-stream') {
            ext = '.7z'
        } else {
            ext = '.zip'
        }

        // Save new project
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

            let newProject = await projectModel.create({
                userid: mongoose.Types.ObjectId(mongoose.Types.ObjectId(req.user.id)),
                fullname: userDetails.fullname,
                semester: academicDetails.semester,
                projectname: fields.projectname,
                projectlang: fields.projectlang,
                projectdesc: fields.projectdesc,
                projectfile: files.filename.newFilename + ext,
            });

            let oldPath = files.filename.filepath;
            let newPath = uploadPath + '/' + files.filename.newFilename + ext;
            let rawData = fs.readFileSync(oldPath)

            fs.writeFile(newPath, rawData, (err) => {
                if (err) return res.status(400).json({ success, error: 'Error while saving the file. Please refresh the page' });
            })

            res.json({ success, msg: 'Your project has been added', newProject });
        } catch (error) {
            return res.status(400).json({ success, err: 'Something went wrong while saving. Please try again' });
        }

    });
})

// Route 3: Update student project link using: POST "api/student/project/updateproject"
router.post('/updateproject', fetchUser, async (req, res) => {
    let ext;
    success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        let { projectid, projectname, projectlang, projectdesc } = fields;

        let updatedProject = {};
        if (projectname) { updatedProject.projectname = projectname };
        if (projectlang) { updatedProject.projectlang = projectlang };
        if (projectdesc) { updatedProject.projectdesc = projectdesc };

        // If file is present
        if (files.filename) {
            let imgTypes = ['application/x-7z-compressed', 'application/zip', 'application/x-zip-compressed', 'application/octet-stream'];
            // Return -1 of index of array in string not found in array
            if (imgTypes.indexOf(files.filename.mimetype) === -1) {
                return res.status(400).json({ success, err: 'Please upload the file in .zip format' });
            }

            if (files.filename.size > 41943040) {
                return res.status(400).json({ success, err: 'Please upload the file below 40MB' });
            }

            if (files.filename.mimetype === 'application/x-7z-compressed' || files.filename.mimetype === 'application/octet-stream') {
                ext = '.7z'
            } else {
                ext = '.zip'
            }

            updatedProject.projectfile = files.filename.newFilename + ext;

            try {
                // Fetch previous image and delete it from folder
                let file = await projectModel.findById(mongoose.Types.ObjectId(projectid)).select('-_id projectfile');

                let previousfile = `${uploadPath}/${file.projectfile}`;
                if (fs.existsSync(previousfile)) {
                    fs.unlinkSync(previousfile)
                }
            } catch (error) {
                return res.status(400).json({ success, err: 'Something went wrong. Please try again' });
            }
        }

        // Update achievement
        try {
            success = true;
            let newProject = await projectModel.findByIdAndUpdate(mongoose.Types.ObjectId(projectid), { $set: updatedProject }, { new: true });

            // Upload image in folder 
            if (files.filename) {
                let oldPath = files.filename.filepath;
                let newPath = uploadPath + '/' + files.filename.newFilename + ext;
                let rawData = fs.readFileSync(oldPath)

                fs.writeFile(newPath, rawData, (err) => {
                    if (err) return res.status(400).json({ success, error: 'Error while saving the file. Please refresh the page' });
                })
            }

            res.json({ success, msg: 'Your project has been updated', newProject });
        } catch (error) {
            return res.status(400).json({ success, err: 'Something went wrong while saving. Please try again' });
        }
    });
});


// Route 4: Delete student project link using: POST "api/student/project/deleteproject"
router.post('/deleteproject', async (req, res) => {
    let success = false;
    try {
        let file = await projectModel.findById(mongoose.Types.ObjectId(req.body.projectid)).select('-_id projectfile');

        let previousfile = `${uploadPath}/${file.projectfile}`;
        if (fs.existsSync(previousfile)) {
            fs.unlinkSync(previousfile)
        }

        let project = await projectModel.findByIdAndDelete(mongoose.Types.ObjectId(req.body.projectid));

        if (project) {
            success = true;
            res.json({ success, msg: 'Your project has been deleted', project });
        } else {
            return res.status(400).json({ success, err: 'Error occured during deletion. Please try again' });
        }
    } catch (err) {
        return res.status(400).json({ success, err: 'Something went wrong. Please try again' });
    }
});

// Download project is in index.js

module.exports = router;