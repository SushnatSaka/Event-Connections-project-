const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const brcypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true,'firstName cannot be empty']},
    lastName: {type: String, required: [true,'lastName cannot be empty']},
    email: {type: String, required: [true,'email cannot be empty'], unique: true},
    password: {type: String, requried: [true,'password cannot be empty'], minLength: [8,'password should be atleast 8 characters'], maxLength: [64,'password should be max 64 characters']}
});

//replace plaintext password with hashed password before saving the document in the database
//pre middleware
userSchema.pre('save',function(next){
    let user = this;
    if (!user.isModified('password')){
        return next();
    }
    brcypt.hash(user.password,10)
    .then(hash => {
        user.password = hash;
        return next();
    })
    .catch(err => next(err));
}); 

userSchema.methods.comparePassword = function(loginPassword){
    return brcypt.compare(loginPassword,this.password);
};

//collection is users
module.exports = mongoose.model('User',userSchema);