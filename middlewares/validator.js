const {body, validationResult} = require('express-validator');
const moment = require('moment');

//check if the route parameter is a valid ObjectId type
exports.validateId = (req,res,next) => {
    let id = req.params.id;
    
    //an objectId is a 24-bit Hex string
    if (!id.match(/^[0-9a-fA-F]{24}$/)){
        let error = new Error('Invalid event id');
        error.status = 400;
        return next(error); 
    } else {
        return next();
    }
};

//check is the Rsvp is valid
exports.validateRsvp = [body('rsvp').notEmpty().toUpperCase().trim().escape().isIn(['YES','NO','MAYBE'])];

exports.validateSignUp = [body('firstName','First name cannot be empty').notEmpty().trim().escape(),
body('lastName','Last name cannot be empty').notEmpty().trim().escape(),
body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password','Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn =  [body('email','Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password','Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateConnection = [body('Title','Title cannot be empty').notEmpty().trim().escape(),
body('Topic','Topic cannot be empty').notEmpty().trim().escape(),
body('Details','Details cannot be empty').isLength({min: 10}).trim().escape(),
body('Where','Where cannot be empty').notEmpty().trim().escape(),
body('When','When cannot be empty | must be a valid date | must be after today').notEmpty().trim().escape().custom((value)=>{
    //console.log(value);
    const inputDate = new Date(value);
    //console.log(inputDate);
    if(moment(inputDate, moment.ISO_8601, true).isValid())
        return true;
}).withMessage('Date must be in a valid format').custom((value) => {
    const inputData = moment(value, 'YYYY-MM-DD', true);

     //console.log(inputData);
     //console.log(moment());
     return inputData.isValid() && inputData.isAfter(moment(), 'day');
 }).withMessage('Date must be after today'),
body('Start','Start cannot be empty | must be a valid time').notEmpty().trim().escape().matches(/^(\d{2}):(\d{2})$/),
body('End','End cannot be empty | must be a valid time').notEmpty().trim().escape().matches(/^(\d{2}):(\d{2})$/).custom((value, {req}) => {
    const Start = req.body.Start;
    const End = req.body.End;
    return Start && End && Start < End;
  })
  .withMessage('end time must come after start time'),
body('ImageURL','URL cannot be empty').notEmpty().trim()];

exports.validateResult = (req,res,next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()){
        errors.array().forEach(error => {
            req.flash('error',error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};