const express = require('express');
const controller = require('../controllers/mainController.js');


const router = express.Router();

//function to get the index page
router.get('/',controller.index);

//function to get the about page
router.get('/about',controller.about);

//function to get the contact page
router.get('/contact',controller.contact);

module.exports = router;