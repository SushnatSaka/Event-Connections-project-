const express = require('express');
const controller = require('../controllers/userController');
const {isGuest,isLoggedIn} = require('../middlewares/auth.js');
const {logInLimiter} = require('../middlewares/rateLimiters.js');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator.js');

const router = express.Router();

//get /users/new send html form for signup
router.get('/new', isGuest, controller.new);

//post /users store details of the new user
router.post('/', isGuest, validateSignUp, validateResult, controller.signup);

//get /users/login send html form for login
router.get('/login', isGuest, controller.login);

//post /users/login check if details match
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.check);

//get /users/profile to display the profile page
router.get('/profile',isLoggedIn, controller.profile);

//get /users/logout to destroy the session
router.get('/logout',isLoggedIn, controller.logout);

module.exports = router;