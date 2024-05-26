const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const connectionSchema = new Schema({
    Title: {type: String, required: [true, 'Title is required']},
    Topic: {type: String, required: [true, 'Topic is required']},
    Details: {type: String, required: [true, 'Details are required'], minLength: [10,'details should contain atleast 10 characters']},
    Where: {type: String, required: [true, 'Location is required']},
    When: {type: String, required: [true, 'Date is required']},
    Start: {type: String, required: [true, 'Start time is required']},
    End: {type: String, required: [true, 'End time is required']},
    Host: {type: Schema.Types.ObjectId, ref:'User', required: [true, 'Host is required']},
    ImageURL: {type: String, required: [true, 'ImageURL is required']} 
});

//collection name is connections in database
module.exports = mongoose.model('Connection',connectionSchema);