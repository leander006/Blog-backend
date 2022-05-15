const mongoose = require("mongoose");
const User = require('../models/Users');
const Post = require('../models/Post')

const CommentSchema = new mongoose.Schema({
    name:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    comment:{
        type:String,
        required:true,
    },
    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }
    
},
{
    timestamps:true
}
);

module.exports =  mongoose.model("Comment",CommentSchema);