const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
var CryptoJS = require("crypto-js");
const userModel = require('../models/User');
const fetchUser = require('../middleware/fetchuser');

const JWT_SECRET = 'hellohoq@reY0u';

const transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'testm6079@gmail.com',
        pass: 'qwertyuiop@123'
    }
});

// Route 1: Create user using: POST "/api/auth/createuser"
router.post('/createuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({min:5}),
    body('username', 'Enter a valid username').isLength({min:3}),
    body('fullname', 'Enter a valid name').isLength({min:5}),
    body('gender', 'Provide your gender').exists(),
], async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, error: errors.errors[0].msg});
    }

    // Check whether the user with this email exists already
    let useremail = await userModel.findOne({email: req.body.email});
    if(useremail){
        return res.status(400).json({success, error: 'Sorry a user with same email already exist'});
    }

    // Check whether the user with this username exists already
    let username = await userModel.findOne({username: req.body.username});
    if(username){
        return res.status(400).json({success, error: 'Sorry a user with same username already exist'});
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    let designation = 'Student'
    if(req.body.code === 'teacher'){
        designation = 'Teacher'
    }else if(req.body.code === 'mentor'){
        designation = 'Mentor'
    }

    // Create new user
    let user = await userModel.create({
        email: req.body.email,
        password: secPass,
        username: req.body.username,
        fullname: req.body.fullname,
        gender: req.body.gender,
        designation
    });
    let data = {
        user: {
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    
    success = true;
    res.json({success, authtoken, designation: user.designation});
});

// Route 2: Authenticate user using: POST "/api/auth/verifyuser" 
router.post('/verifyuser', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, error: errors.errors[0].msg});
    }

    // Check if user exist or not
    let user = await userModel.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({success, error: 'Please try to login with correct credentials'});
    }

    // Check password of exist user is correct or not
    let passwordCompare = await bcrypt.compare(req.body.password, user.password);
    if(!passwordCompare){
        return res.status(400).json({success, error: "Please try to login with correct credentials"});
    }

    let data = {
        user: {
            id: user.id
        }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    res.json({success, authtoken, designation: user.designation});
});

// Route 3: Send recovery link using: POST "api/auth/sendrecoverylink"
router.post('/sendrecoverylink', [
    body('email', 'Enter a valid email').isEmail(),
], async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, error: errors.errors[0].msg});
    }

    // Check if user exist or not
    let user = await userModel.findOne({email: req.body.email});
    if(!user){
        return res.status(400).json({success, error: 'Email does not exist'});
    }

    // Encrypting email of a user
    var ciphertext = CryptoJS.AES.encrypt(req.body.email, 'secret key 123').toString();

    const mailOptions = {
        from: 'testm6079gmail@gmail.com',
        to: req.body.email,
        subject: 'Recovery Email',
        text: `Recovery link`,
        html: '<p>Click <a href="http://localhost:3000/recover/?qpvnfhdoeG3YDBybcbTljMdrshsynTWMZIRVDbs='+ciphertext+'">here</a> to reset your password</p>'
    };
    transporter.sendMail(mailOptions, function(err, info){
        if(err){
            return res.status(400).json({success, error: 'Something went wrong. Please try again after sometime'});;
        }else{
            success = true;
            res.json({success, msg: 'A recovery link has been send to your email'});
        }
    });
});

// Route 4: Change password link using: POST "api/auth/changepassword"
router.post('/changepassword', [
    body('password', 'Password must be atleast 5 characters').isLength({min:5}),
    body('confirmpassword', 'Password must be atleast 5 characters').isLength({min:5})
], async (req, res) => {
    let success = false;

    // If there are errors, return bad request and the errors
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success, error: errors.errors[0].msg});
    }

    // Remove '+' instead of 'white space' in email url
    let email = req.body.email.split(' ').join('+')

    // Decrypt email from url param
    const bytes  = CryptoJS.AES.decrypt(email, 'secret key 123');
    const userEmail = bytes.toString(CryptoJS.enc.Utf8);

    // Check whether the user with this email exists or not and fetch password
    let useremail = await userModel.findOne({email: userEmail});
    if(!useremail){
       return res.status(400).json({success, error: 'Sorry a user with email does not exist'});
    }

    if(req.body.password !== req.body.confirmpassword){
        return res.status(400).json({success, error: 'Password and confirm password not matched' });
    }

    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    success = true;
    await userModel.findOneAndUpdate({email: userEmail}, {$set: {password: secPass}}) 
    res.json({success, msg: 'Your password has been changed. Please login with your new password'});
});

module.exports = router;