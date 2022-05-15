const mongoose = require("mongoose");


const PostSchema = new mongoose.Schema({
    postImage:{
        type:String, 
    },
    title:{
        type:String,
        required:true,
        unique:true,
    },
    desc:{
        type:String,
        required:true,
        unique:true,
    },
    categories:{
        type:String,
        unique:false
    },
    comments:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:'Comment',
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
},
{
    timestamps:true
}
);

module.exports =  mongoose.model("Post",PostSchema);