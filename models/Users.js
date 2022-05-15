const mongoose = require("mongoose");
const Post= require('../models/Post')


const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profilePic:{
        type:String, 
        unique:true,
        required:true,
    },
    isAdmin:{
        type:String,
        default:false,
    },
},
{
    timestamps:true
}
);

module.exports =  mongoose.model("User",UserSchema);