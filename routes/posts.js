const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddileware");



//Create post
router.post("/",protect,async(req,res)=>{
    const post = {...req.body,createdBy:req.user._id}
    
    const newPost = new Post(post);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json(error.message);
  
    }
});

//Update post
router.put("/:id",protect,async(req,res)=>{ 
    try {
        const post = await Post.findById(req.params.id);
        const users = req.user._id
        // console.log(post.createdBy);
        // console.log(users.equals(post.createdBy));

        if(users.equals(post.createdBy))
        {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
                    $set :req.body,
                },{new:true});
                return res.status(200).json(updatedPost);
            } catch (error) {
                return res.status(500).json(error.message);
            }
        }
        else{
            return res.status(401).json("You can update only your Posts");
        }
    } catch (error) {
        return res.status(500).json(error)
    }

});

//Delete post
router.delete("/:id",protect,async(req,res)=>{
  
    const post = await Post.findById(req.params.id);
    const users = req.user._id


         if(users.equals(post.createdBy)){
            try {
                await post.delete();
                return res.status(200).json("post deleted successfully");
               
            } catch (error) {
                console.log(error);
                return res.json(error.message);
            }
        }
        else{
            return res.status(500).json("Cannot delete other's post")
        }
});

//Get Single Post

router.get("/:id",protect,async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id).populate("createdBy","-password").populate({path:"comments",populate:{path:"name"}}).sort({createdAt:-1}); 
        return res.status(200).json(post);
    } catch (error) {
        return res.status(404).json(error.message);
    }
})

//Get all posts and  by categories

router.get('/',protect,async(req,res) =>{
    const post = await Post.aggregate([
        {$project: {commentCount : {$size : "$comments"}}},
        {$sort : {"commentCount" : -1}}
    ])
    const {Cat} = req.query
    const categories = await Post.find({categories :{$eq : Cat}}).populate("createdBy","-password").populate({path:"comments",populate:{path:"name"}});
    if(!Cat)
    {
        const posts = await Post.find( { _id: { $ne: post[0]._id } } ).populate("createdBy","-password").populate({path:"comments",populate:{path:"name"}});
        return res.status(200).json(posts);
    }
    else{
        try {
            return res.status(200).json(categories)
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
})

//Get popular post 
router.get('/popular/post',protect,async(req,res) =>{
    try {
        const post = await Post.aggregate([
            {$project: {commentCount : {$size : "$comments"}}},
            {$sort : {"commentCount" : -1}}
        ])
        const newPost = await Post.findById(post[0]._id).populate("createdBy","-password").populate({path:"comments",populate:{path:"name"}});
        res.status(200).json(newPost);

    } catch (error) {
        res.status(500).json(error.message);
    }

})

module.exports = router;