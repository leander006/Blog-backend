const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require('bcrypt');
const generateToken = require('../config/authToken')
const asyncHandler = require('express-async-handler')


router.post("/register",asyncHandler(async(req,res)=>{
    const {username,email,password,profilePic} = req.body;
    if(!username || !email || !password){

        res.status(401).json("Please enter all  field");
        return;

    } 
  
    const userExist = await User.findOne({username});
    const emailExist = await User.findOne({email})
    try {
         if(userExist)
        {
            res.status(400).json("Username Exists");
            return
            
        }
    else  if(emailExist)
    {
        res.status(400).json("Email Exists");
        return
        
    }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username:username,
            email:email,
            password:hashPassword,
            profilePic:profilePic
        })

        const user = await newUser.save();
        res.status(200).json({
            user,
            token : generateToken(username.id)
        });
    } catch (error) {
        res.status(500).json("Failed to sign in");
           
    }

}))

//login
router.post("/login",asyncHandler(async(req,res)=>{
    const {username,password} = req.body;
  
    const user = await User.findOne({username});
    const validate = await bcrypt.compare(req.body.password,user.password)
    if(!username|| !password)
    {
        res.status(402).json("Please all field")
        return;
    }
    if(!user)
    {
        res.status(400).json("Wrong Credentails !");
        return;
    }
    if(!validate)
    {
        res.status(400).json("Wrong Password");
        return;
    }
    try {
     
       const { password, ...others } = user._doc;
       res.status(200).json({others , token : generateToken(username.id)});
    } catch (error) {
        res.status(501).json(error)
       console.log(error);
    }
}))

;
 
module.exports = router;