const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postRoute = require("./routes/posts");



const cors = require('cors')

dotenv.config();
app.use(express.json());
app.use(cors())

mongoose.connect(process.env.MONGO_URL
    ).then(console.log("connected to mongodb")
    ).catch((err)=> console.log(err));


    
app.use("/api/auth",authRoute) ;

app.use("/api/users",usersRoute) ;

app.use("/api/posts",postRoute) ;





app.get('/',(req,res)=>{
    res.send("hello");
})


app.listen(process.env.PORT || 4000,()=>{
    console.log("backend is running");
})