const mongoose = require('mongoose');
//const  Schema  = mongoose.Schema; 
const { Schema } = mongoose; //es2015

const userSchema = new Schema({
    googleId: String
});

mongoose.model('users', userSchema);