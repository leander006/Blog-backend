const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const commentsRoute = require('./routes/comments')

const {protect} = require('./middleware/authMiddileware');
const cors = require('cors')


app.use(express.json());
app.use(cors())

dotenv.config();

mongoose.connect(process.env.MONGO_URI
    ).then(console.log("connected to mongodb")
).catch((err)=> console.log(err));


app.use("/api/auth",authRoute) ;

app.use("/api/users",usersRoute) ;

app.use("/api/posts",postRoute) ;

app.use("/api/comments",commentsRoute) ;

//------deploy to heroku -------------------------


// __dirname = path.resolve()

// if(process.env.NODE_ENV === 'production'){
// app.use(express.static(path.join(__dirname,'/frontend/build')))

//     app.get('*',(req,res) =>{
//         res.sendFile(path.resolve(__dirname,"frontend","build","index.html"));
//     })
// }
// else{
//     app.get('/',(req,res)=>{
//         res.send("hello");
//     })
    
// }

//--------------------------------------


app.get('/',(req,res)=>{
           res.send("hello");
         })


app.listen(process.env.PORT || 4001,()=>{
    console.log("backend runnig");
})