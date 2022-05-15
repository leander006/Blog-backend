const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");
const bcrypt = require('bcrypt');
const {protect} = require('../middleware/authMiddileware')

//update user
router.put("/:id",protect,async(req,res)=>{
    
   
    if(req.user._id === req.params.id){
            if(req.body.password)
            {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }
            try {
                const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                    $set :req.body,
                },{new:true});
                
                return res.status(200).json("User updated successfully");
            } catch (error) {
                return res.status(401).json( error);
            }
   
} else{
    res.status(404).json("You can update only your account !");
}
});

//delete the user
router.delete("/:id",protect,async(req,res)=>{
        try {
            const user = await User.findById(req.params.id)
            if(user){
                try {
                    await Post.deleteMany({createdBy:user._id})
                    await User.findByIdAndDelete(req.params.id);
                    return res.status(200).json("User deleted successfully");
                 } catch (error) {
                     return res.status(500).json( error);
                 }
            }
           
        } catch (error) {
            return res.send(401).json("User not found");
        }
});

//Get user

router.get("/:id",protect,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc
        return res.status(200).json(others);
    } catch (error) {
        return res.status(404).json(error);
    }
})



module.exports = router;