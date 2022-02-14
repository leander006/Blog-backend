const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddileware");


//Create post
router.post("/",protect,async(req,res)=>{
    const newPost = new Post(req.body);
    try {
        const savedPost =  await newPost.save();
        res.status(200).json(savedPost);
    } catch (error) {
        res.status(500).json(error);
    }
});

//Update post
router.put("/:id",protect,async(req,res)=>{
    const {username} = req.body;
   
    try {
        const post = await Post.findById(req.params.id);
    
        if(post.username === username)
        {
            try {
                const updatedPost = await Post.findByIdAndUpdate(req.params.id,{
                    $set :req.body,
                },{new:true});
                res.status(200).json(updatedPost);
            } catch (error) {
                res.status(500).json(error);
            }
        }
        else{
            res.status(401).json("You can update only your Posts");
        }
    } catch (error) {
        res.status(500).json(error)
    }

});

//Delete post
router.delete("/:id",protect,async(req,res)=>{
   
     try {
        const post = await Post.findById(req.params.id);
        res.json("post "+post.username)
        res.json("frontend "+req.body.others.username)
        if(post.username === req.body.others.username)
        {
            try {
                await post.delete();
                res.status(200).json("Post deleted successfully! ");
            } catch (error) {
                res.status(501).json("inside auth"+error.message);
            }
        }
        else{
            res.status(401).json("You can delete only your Posts");
        }
    } catch (error) {
        res.status(500).json("outside auth"+error.message)
    }

});

//Get Post

router.get("/:id",protect,async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id); 
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json(error);
    }
})

//Get all post

router.get("/",async(req,res)=>{
    const username = req.query.user;

    try {
        let posts;
       if(username)
       {
           posts = await Post.find({username});
       }
       else{
           posts = await Post.find();
       }
       res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;