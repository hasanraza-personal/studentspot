const express = require('express');
const newsletterModel = require('../../models/Newsletter');
const router = express.Router();
const fetchUser = require('../../middleware/fetchuser');
const mongoose = require('mongoose');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

const uploadPath = path.join(__dirname, '../../public/images/newsletter_images');

// Route 1: Get newsletter link using: POST "api/newsletter/getnewsletter"
router.get('/getnewsletter', fetchUser, async (req, res) => {
    let newsletter = await newsletterModel.find();

    let success = false;
    if (newsletter) {
        success = true;
        res.json({ success, newsletter });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please refresh the page' });
    }
});

// Route 2: Add newsletter link using: POST "api/newsletter/addnewsletter"
router.post('/addnewsletter', fetchUser, async (req, res) => {
    const imageName = new Date().getTime() + '.jpeg';
    const savePath = path.join(uploadPath, imageName);
    success = false;

    let form = new formidable.IncomingForm();
    form.parse(req, async (error, fields, files) => {
        if (!fields.title) return res.status(400).json({ success, err: 'Please provide a valid title name' });
        if (!fields.desc) return res.status(400).json({ success, err: 'Please provide a valid description' });

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

        success = true;
        let newNewsletter = await newsletterModel.create({
            title: fields.title,
            desc: fields.desc,
            photo: imageName
        });

        // Upload image in folder 
        sharp(files.photo.filepath).jpeg({
            quality: 70
        }).toFile(savePath, (error, info) => {
            if (error) {
                return res.status(400).json({ success, err: 'Something went wrong during compression. Please try again' });
            }
        });
        res.json({ success, msg: 'Newsletter has been added', newNewsletter });
    });
})

// Route 3: Delete newsletter link using: POST "api/newsletter/deletenewsletter"
router.post('/deletenewsletter', fetchUser, async (req, res) => {
    console.log(req.body.newsletterid);
    let newsletterData = await newsletterModel.findById(mongoose.Types.ObjectId(req.body.newsletterid)).select('-_id photo')
    
    let newsletterphoto = `${uploadPath}/${newsletterData.photo}`;
    if (fs.existsSync(newsletterphoto)) {
        fs.unlinkSync(newsletterphoto)
    }
    let newsletter = await newsletterModel.findByIdAndDelete(mongoose.Types.ObjectId(req.body.newsletterid));

    let success = false;
    if (newsletter) {
        success = true;
        res.json({ success, msg: 'Your newsletter has been deleted', newsletter });
    } else {
        return res.status(400).json({ success, err: 'Something went wrong. Please try again', newsletter });
    }
})

module.exports = router;