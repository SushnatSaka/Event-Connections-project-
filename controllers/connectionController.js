const model = require('../models/connection.js');
const rsvpModel = require('../models/rsvp.js');

//get /connections send all the connections to the user
exports.index = (req,res,next) => {
    model.find()
    .then(connections => {
        let distinct_category = [];
        connections.forEach(connection => {
            let t = connection.Topic;
            if (!distinct_category.includes(t)){
                distinct_category.push(t);
            }
        });
        res.render('./connection/connections.ejs',{connections: connections, distinct_category: distinct_category});
    })
    .catch(err => next(err));
};

//get /connections/new send html form to create a new connection
exports.new = (req,res) => {
    res.render('./connection/newConnection.ejs');
};

//post /connections create a new connection
exports.create = (req,res,next) => {
    let connection = new model(req.body);
    console.log(req.body)
    connection.Host = req.session.user;
    console.log(connection);
    connection.save()
    .then(connection => {
        res.redirect('/connections');
    })
    .catch(err => {
        if (err.name === 'ValidationError'){
            req.flash('error',err.message);
            res.redirect('back');
        }
        next(err);
    });
};

//get /connections/:id send details of connection identified by id
exports.show = (req,res,next) => {
    let id = req.params.id;

    Promise.all([model.findById(id).populate('Host','firstName lastName'), rsvpModel.countDocuments({connection: id, rsvp: "YES"})])
    .then((results) => {
        const [connection,count_rsvps] = results;
        if (connection){
            res.render('./connection/connection.ejs',{connection,count_rsvps});
        }
        else{
            let error = new Error('Cannot find an event with id '+id);
            error.status = 404;
            next(error);
        }
    })
    .catch(err => next(err));
};

//get /connections/:id/edit send html form for editing an existing story
exports.edit = (req,res,next) => {
    let id = req.params.id;

    model.findById(id)
    .then(connection => {
            res.render('./connection/edit.ejs',{connection});
    })
    .catch(err => next(err));
    
};

//put /connections/:id update the connection identified by id
exports.update = (req,res,next) => {
    let id =req.params.id;

    let connection = req.body;
    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection => {
        req.flash('success','Successfully updated connection');
        res.redirect('/connections/'+id);
    })
    .catch(err => {
        if (err.name === "ValidationError"){
            req.flash('error',err.message);
            res.redirect('back');
        }
        next(err);
    });
};

//delete /connections/:id delete the connection identified by id
exports.delete = (req,res,next) => {
    let id = req.params.id;

    Promise.all([model.findByIdAndDelete(id, {useFindAndModify: false}),rsvpModel.deleteMany({connection: id})])
    .then((connection) => {
        req.flash('success','Successfully deleted connection and its associated RSVPs');
        res.redirect('/connections');
    })
    .catch(err => next(err));
};

//post /connections/:id/rsvp
exports.editRsvp = (req,res,next) => {
    console.log(req.body.rsvp);
    let id= req.params.id;

    rsvpModel.findOne({connection: id, user: req.session.user})
    .then(result => {
        if(result){
            //update
            rsvpModel.findByIdAndUpdate(result._id, {rsvp:req.body.rsvp}, {useFindAndModify: false, runValidators: true})
            .then(rsvp => {
                req.flash('success','Successfully updated RSVP');
                res.redirect('/users/profile');
            })
            .catch(err => {
                if(err.name === 'ValidationError'){
                    req.flash('error',err.message);
                    res.redirect('back');
                }
                next(err);
            });
        } else {
            //insert
            let rsvp = new rsvpModel({
                rsvp: req.body.rsvp,
                user: req.session.user,
                connection: id
            });
            rsvp.save()
            .then(rsvp => {
                req.flash('success','Successfully created RSVP');
                res.redirect('/users/profile');
            })
            .catch(err => {
                req.flash('error',err.message);
                next(err);
            });
        }
    })
    .catch(err => next(err));
};