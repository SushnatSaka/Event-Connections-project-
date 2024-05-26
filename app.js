//require modules
const express = require('express');
const ejs = require('ejs');
const methodOverride = require('method-override');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const connectionRoutes = require('./routes/connectionRoutes.js');
const mainRoutes = require('./routes/mainRoutes.js');
const userRoutes = require('./routes/userRoutes.js');


//create app
const app = express();

//configure app
let host = 'localhost';
let port = 8084;
let url = 'mongodb://localhost:27017/NBAD';
app.set('view engine','ejs');

//connect to mongoDB 
mongoose.connect(url)
.then(() => {
    //start the server
    app.listen(port,host,()=>{
    console.log('Server is running on port ', port);
});
})
.catch(err => console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'djfhskdjfsjhsfdgksfhsla',
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://localhost:27017/NBAD'})
}));

app.use(flash());

app.use((req,res,next)=> {
    //console.log(req.session);
    res.locals.user = req.session.user||null;
    res.locals.username = req.session.username||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})
 
//set routes
app.use('/',mainRoutes);
app.use('/connections',connectionRoutes);
app.use('/users',userRoutes);

//error handling
app.use((req,res,next)=> {
    let error = new Error('The server cannot locate '+req.url);
    error.status = 404;
    next(error);
});

app.use((err,req,res,next) => {
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message = ('Internal Server Error');
    }
    res.status(err.status); 
    res.render('./error.ejs',{error: err});
});

