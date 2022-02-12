const router = require("express").Router();
const User = require("../models/Users");
const Post = require("../models/Post");
const bcrypt = require('bcrypt');
const { protect } = require("../middleware/authMiddileware");

//update
router.put("/:id",protect,async(req,res)=>{
    
    if(req.body.userId === req.params.id){
        
        if(req.body.password)
        {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt);
            console.log("ejbrkjtb");
        }
        
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id,{
                $set :req.body,
            },{new:true});
       console.log(updatedUser);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(401).json( error);
            console.log(error);
        }
   
} else{
  
    res.status(404).json("You can update only your account !");
}
});

//delete
router.delete("/:id",protect,async(req,res)=>{

    // if(req.body.userId === req.params.id){
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
       
   
// } else{
//     res.status(404).json("You can delete only your account !");
// }
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