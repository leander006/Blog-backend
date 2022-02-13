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
        if(post.username === req.body.others.username)
        {
            try {
                await post.delete();
                res.status(200).json("Post deleted successfully! ");
            } catch (error) {
                res.status(500).json(error);
            }
        }
        else{
            res.status(401).json("You can delete only your Posts");
        }
    } catch (error) {
        res.status(500).json(error)
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
    const catname = req.query.cat;
    try {
        let posts;
       if(username)
       {
           posts = await Post.find({username});
       }else if(catname)
       {
           posts = await Post.find({categories :{
               $in:[catname],
           },
        })
       }else{
           posts = await Post.find();
       }
       res.status(200).json(posts);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router;