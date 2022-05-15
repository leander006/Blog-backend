const router = require("express").Router();
const { protect } = require("../middleware/authMiddileware");
const Comments = require('../models/Comments')
const Post= require('../models/Post')


router.post('/:id',protect,async(req,res) =>{
    const Posts= await Post.findById(req.params.id)
    const commentsss = {...req.body,name:req.user.id}
    const newcomments = new Comments(commentsss)
    try {
            const savedcomments = await newcomments.save();
            await Posts.updateOne({$push :{comments:savedcomments._id}})
            res.status(200).json(await Post.findById(req.params.id).populate({path:"comments",populate:{path:"name"}}));

    } catch (error) {
        return res.status(500).json(error.message)
    }
})


router.get('/:id',protect,async(req,res) =>{
    try {
            res.status(200).json(await Post.findById(req.params.id).populate({path:"comments"}).sort({"createdAt":-1}).populate({path:"comments",populate:{path:"name"}}));

    } catch (error) {
        return res.status(500).json(error.message)
    }
})
module.exports = router;