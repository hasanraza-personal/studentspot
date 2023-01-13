const express = require('express');
const router = express.Router();
const userModel = require('../models/User');
const questionModel = require('../models/Question');
const answerModel = require('../models/Answer.js')
const fetchUser = require('../middleware/fetchuser');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

module.exports = router;

// Route 1: Get all question link using: POST "api/qna/questionid" 
router.get('/', fetchUser, async (req, res) => {
    let success = false;
    try {
        success = true;
        let Qna = await questionModel.find()
            .populate('answer', 'userid').sort('-createdat');
        res.json({ success, Qna });
    } catch (err) {
        return res.status(400).json({ success, error: 'Something went wrong. Please try again' });
    }
});

// Route 2: Get question with all data link using: POST "api/qna/questionid" 
router.get('/:questionid', fetchUser, async (req, res) => {
    let success = false;
    try {
        success = true;
        let singleQna = await questionModel.findById(mongoose.Types.ObjectId(req.params.questionid))
            .populate('answer');
        res.json({ success, singleQna });
    } catch (err) {
        return res.status(400).json({ success, error: 'Something went wrong. Please try again' });
    }
});

// Route 3: Add question link using: POST "api/qna/addquestion"
router.post('/addquestion', fetchUser, [
    body('question', 'Enter a valid question').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.errors[0].msg });
    }

    try {
        success = true;
        // Fetch user fullname
        let userDetails = await userModel.findById(mongoose.Types.ObjectId(req.user.id)).select('-_id fullname photo');
        let newQuestion = await questionModel.create({
            userid: mongoose.Types.ObjectId(req.user.id),
            fullname: userDetails.fullname,
            photo: userDetails.photo,
            question: req.body.question,
        });
        res.json({ success, msg: 'Your question has been added', newQuestion });
    } catch (err) {
        return res.status(400).json({ success, error: 'Something went wrong while saving. Please try again' });
    }
});

// Route 4: Delete question link using: POST "api/qna/deletequestion"
router.post('/deletequestion', async (req, res) => {
    // Delete Question
    let question = await questionModel.findByIdAndDelete(mongoose.Types.ObjectId(req.body.id));
    // Delete answers of that question
    let answer = await answerModel.deleteMany({ questionid: mongoose.Types.ObjectId(req.body.id) });

    let success = false;
    if (question) {
        success = true;
        res.json({ success, msg: 'Your question has been deleted', question });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please try again', question });
    }
});

// Route 4: Add answer link using: POST "api/qna/addanswer"
router.post('/addanswer', fetchUser, [
    body('answer', 'Enter a valid answer').isLength({ min: 5 }),
], async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, error: errors.errors[0].msg });
    }

    // Fetch user fullname
    let userDetails = await userModel.findById(mongoose.Types.ObjectId(req.user.id)).select('-_id fullname photo');

    try {
        success = true;

        let newAnswer = await answerModel.create({
            questionid: mongoose.Types.ObjectId(req.body.questionid),
            userid: mongoose.Types.ObjectId(req.user.id),
            fullname: userDetails.fullname,
            photo: userDetails.photo,
            answer: req.body.answer,
        });

        // Push answerid to question
        let question = await questionModel.findById(mongoose.Types.ObjectId(req.body.questionid));
        question.answer.push(newAnswer._id);
        question.save();

        res.json({ success, msg: 'Your answer has been added', newAnswer });
    } catch (err) {
        return res.status(400).json({ success, err: 'Something went wrong while saving. Please try again' });
    }
});

// Route 5: Add response link using: POST "api/qna/verifyanswer"
router.post('/verifyanswer', fetchUser, async (req, res) => {
    let success = false;
    // Fetch user fullname
    let userDetails = await userModel.findById(mongoose.Types.ObjectId(req.user.id)).select('-_id fullname photo');

    // Check if teacher has already verified ans
    let verificationStatus = await answerModel.findOne({ $and: [{verifierid: mongoose.Types.ObjectId(req.user.id)}, {_id: mongoose.Types.ObjectId(req.body.answerid)}] }).select('_id');

    success = true;

    if (!verificationStatus) {
        // Add verification to answer
        let newVerification = {
            verified: 1,
            verifierid: mongoose.Types.ObjectId(req.user.id),
            verifierfullname: userDetails.fullname,
        };
        await answerModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.answerid), { $set: newVerification });
        res.json({ success, msg: 'Your have verified this answer', fullname: userDetails.fullname });
    } else {
        // Remove verification to answer
        let removeVerification = {
            verified: 1,
            verifierid: 1,
            verifierfullname: 1,
        };
        await answerModel.findByIdAndUpdate(mongoose.Types.ObjectId(req.body.answerid), { $unset: removeVerification });
        res.json({ success, msg: 'Your have unverified this answer' });    
    }
})

// Route 4: Delete answer link using: POST "api/qna/deleteanswer"
router.post('/deleteanswer', async (req, res) => {
    // Delete Answer
    let answer = await answerModel.findByIdAndDelete(mongoose.Types.ObjectId(req.body.answerid));
    
    let success = false;
    if (answer) {
        success = true;
        res.json({ success, msg: 'Your answer has been deleted', answer });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please try again' });
    }
});

// Route 5: Search question link using: POST "api/qna/searchquestion"
router.post('/searchquestion', async (req, res) => {
    console.log("Question: ",req.body.question)
     let  typeValue  = req.body.question;
     // console.log(typeValue);

    const resType = await questionModel.find({ question: {$regex: '^'+typeValue, $options: 'i'}}).select('question _id').sort({createdAt:1});
    res.send(resType);
});