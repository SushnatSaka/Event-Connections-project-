const Connection = require('../models/connection.js');

//check if user is a guest
exports.isGuest = (req,res,next) => {
    if(!req.session.user){
        return next();
    } else {
        req.flash('error','You are loggen in already');
        return res.redirect('/users/profile');
    }
}

//check if user is authenticated
exports.isLoggedIn = (req,res,next) => {
    if(req.session.user){
        return next();
    } else {
        req.flash('error','You need to log in first');
        return res.redirect('/users/login');
    }
}

//check if user is the host of the story
exports.isHost = (req,res,next) => {
    let id = req.params.id;

    Connection.findById(id)
    .then(connection => {
        if(connection){
            if (connection.Host == req.session.user){
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let error = new Error('Cannot find an event with id '+id);
            error.status = 404;
            next(error);
        }
    })
    .catch(err => next(err));
}

//check if user is not the host of the story
exports.isNotHost = (req,res,next) => {
    let id = req.params.id;

    Connection.findById(id)
    .then(connection => {
        if(connection){
            if (connection.Host != req.session.user){
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let error = new Error('Cannot find an event with id '+id);
            error.status = 404;
            next(error);
        }
    })
    .catch(err => next(err));
}