const router = require("express").Router();
const User = require("../models/Users");
const bcrypt = require('bcrypt');
const generateToken = require('../config/authToken')
const asyncHandler = require('express-async-handler')


router.post("/register",asyncHandler(async(req,res)=>{
    const {username,email,password,profilePic} = req.body;
    if(!username || !email || !password)
    {
        return res.status(401).json("Please enter all  field");
    } 
    const userExist = await User.findOne({username});
    const emailExist = await User.findOne({email})
    const profileExist = await User.findOne({profilePic})
    try {
         if(userExist)
        {
            return res.status(400).json("Username Exists");
        }
    else  if(emailExist)
    {
        return res.status(400).json("Email Exists");
    }
    else  if(profileExist)
    {
        return res.status(400).json("Profile photo is already taken ");
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
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json("Failed to sign in");
           
    }

}))

//login
router.post("/login",asyncHandler(async(req,res)=>{
    const {username} = req.body;

    try {
        if(!username || !req.body.password )
        {
            
            return res.status(402).json("Please all field")
        }
        const user = await User.findOne({username});
        if(!user)
        {
            return res.status(400).json("User does not exits!");
        }
        const validate = await bcrypt.compare(req.body.password,user.password)
        if(!validate)
        { 
            return res.status(402).json("Invalid password")
        }
       const { password, ...others } = user._doc;

       res.status(200).json({others , token : generateToken(user.id)});
    } catch (error) {
        res.status(501).json(error)
       console.log(error);
    }
}))

;
 
module.exports = router;