//function to get the index page
exports.index = (req,res)=>{
    res.render('index.ejs');
};

//function to get the about page
exports.about = (req,res)=>{
    res.render('about.ejs');
};

//function to get the contact page
exports.contact = (req,res)=>{
    res.render('contact.ejs');
};
