const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");
const bcrypt = require('bcrypt');
const { protect } = require("../middleware/authMiddileware");

//update
router.put("/:id",protect,async(req,res)=>{
    const {userId}= req.body
    console.log(req.params.id);
    const user = await User.findById(req.params.id)
    const post = await Post.find({username:user.username})
    console.log(post);
    console.log(user.username);
    if(userId === req.params.id){
        
        if(!post){
            if(req.body.password)
            {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            
            try {
                const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                    $set :req.body,
                },{new:true});
                
                res.status(200).json(updatedUser);
            } catch (error) {
                res.status(401).json( error);
                console.log(error);
            }

        }else{
            res.status(402).json("First delete all your post")
        }
   
} else{
  
    res.status(404).json("You can update only your account !");
}
});

//delete
router.delete("/:id",protect,async(req,res)=>{
        try {
            
            const user = await User.findById(req.params.id)
          
            if(user){
                try {
                    await Post.deleteMany({username:user.username})
                    await User.findByIdAndDelete(req.params.id);
                     res.status(200).json("User deleted successfully");
                 } catch (error) {
                     res.status(500).json( error);
                 }
            }
           
        } catch (error) {
            res.send(401).json("User not found");
        }
});

//Get user

router.get("/:id",protect,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password , ...others} = user._doc
        res.status(200).json(others);
    } catch (error) {
        res.status(404).json(error);
    }
})



module.exports = router;