const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    rsvp: {type: String, required: [true,'RSVP is required']},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: [true,'User is requried']},
    connection: {type: Schema.Types.ObjectId, ref: 'Connection', required: [true,'Connection is required']}
},{timestamps: true});

//collection name is rsvps
module.exports = mongoose.model('Rsvp',rsvpSchema);