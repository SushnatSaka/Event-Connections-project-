const { compare } = require('bcrypt');
const User = require('../models/user.js');
const Connection = require('../models/connection.js');
const rsvpModel = require('../models/rsvp.js');

//get /users/new send html form for signup
exports.new = (req,res,next) => {
    res.render('./user/new.ejs');
};

//post /users store details of the new user
exports.signup = (req,res,next) => {
    let user = new User(req.body);
    user.save()
    .then(user => {
        req.flash('success','Registration succeeded!');
        return res.redirect('/users/login');
    })
    .catch(err => {
        if(err.name === 'ValidationError'){
            req.flash('error',err.message);
            return res.redirect('/users/new');
        }
        if(err.code === 11000){
            req.flash('error','Email address has been used');
            return res.redirect('/users/new');
        }
        next(err);
    });
};

//get /users/login send html form for login
exports.login = (req,res,next) => {
    res.render('./user/login.ejs');
};

//post /users/login check if details match
exports.check = (req,res,next) => {
    let email = req.body.email;
    let password = req.body.password;
    User.findOne({email:email})
    .then(user => {
        if(user){
            user.comparePassword(password)
            .then(result => {
                if (result) {
                    req.session.user = user._id; //store user's id in session
                    req.session.username = user.firstName;
                    req.flash('success','You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    req.flash('error','Wrong password');
                    //console.log('wrong password');
                    res.redirect('/users/login');
                }
            })
        } else {
            req.flash('error','Wrong email address');
            //console.log('wrong email address');
            res.redirect('/users/login');
        }
    })
    .catch(err => next(err));
};

//get /users/profile to display the profile page
exports.profile = (req,res,next) => {
    let id = req.session.user;
    Promise.all([User.findById(id),Connection.find({Host: id}),rsvpModel.find({user: id}).populate('connection','Title Topic')])
    .then(results => {
        const [user,connections,rsvps] = results;
        res.render('./user/profile.ejs',{user,connections,rsvps});
    })  
    .catch(err => next(err));
};

//get /users/logout to destroy the session
exports.logout = (req,res,next) => {
    req.session.destroy(err => {
        if (err){
            return next(err);
        } else {
            res.redirect('/'); 
        }
    });
};