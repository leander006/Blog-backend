const router = require("express").Router();
const User = require("../models/Users");
const Category = require("../models/Category");
const { protect } = require("../middleware/authMiddileware");

//Add catogory
router.post("/",protect,async(req,res) =>{

    const newCat = new Category(req.body)
    try {
        const saveCat = await newCat.save();
        res.status(200).json(saveCat);
    } catch (error) {
        res.status(500).json(error);
    }
})
// Get category

// router.get("/",protect,async(req,res) =>{

//     try {
//         const Cat = await Category.find();
//         res.status(200).json(Cat);
//     } catch (error) {
//         res.status(500).json(error);
//     }
// })
module.exports = router;

