const express = require('express');
const router = express.Router();
const achievementModel = require('../../models/Achievement');
const internshipModel = require('../../models/Internship');
const projectModel = require('../../models/Project');
const userModel = require('../../models/User');
const fetchUser = require('../../middleware/fetchuser');
const mongoose = require('mongoose');

// Achievement Route
// Route 1: Get student all achievement link using: GET "api/teacher/studentachievement"
router.get('/studentachievement', async (req, res) => {
    let achievement = await achievementModel.find()
    res.json({ achievement });
})

// Route 2: Get student achievement link using: POST "api/teacher/studentachievement"
router.post('/studentachievement', async (req, res) => {
    if(req.body.semester === 'All Semester'){
        let achievement = await achievementModel.find();
        res.json({ achievement });
    }else{
        let achievement = await achievementModel.find({semester: req.body.semester})
        res.json({ achievement });
    }
})


// Internship Route
// Route 3: Get student internship link using: POST "api/teacher/studentinternship"
router.get('/studentinternship', async (req, res) => {
    let internship = await internshipModel.find()
    res.json({ internship });
})

// Route 4: Get student achievement link using: POST "api/teacher/studentinternship"
router.post('/studentinternship', async (req, res) => {
    if(req.body.semester === 'All Semester'){
        let internship = await internshipModel.find();
        res.json({ internship });
    }else{
        let internship = await internshipModel.find({semester: req.body.semester})
        res.json({ internship });
    }
})


// Project Route
// Route 5: Get student project link using: POST "api/teacher/studentproject"
router.get('/studentproject', async (req, res) => {
    let project = await projectModel.find()
    res.json({ project });
})

// Route 6: Get student project link using: POST "api/teacher/studentproject"
router.post('/studentproject', async (req, res) => {
    if(req.body.semester === 'All Semester'){
        let project = await projectModel.find();
        res.json({ project });
    }else{
        let project = await projectModel.find({semester: req.body.semester})
        res.json({ project });
    }
})

module.exports = router;