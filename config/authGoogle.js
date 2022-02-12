// // const {OAuth2Client} = require("google-auth-library")


// const client = new OAuth2Client("17132200157-imj848t0rko23tnfbd27g5b35vj28tkb.apps.googleusercontent.com");

// const googleLogin =  async(req,res) =>{
//     const {tokenId} =  await req.body;
//     client.verifyIdToken({tokenId ,audience:"17132200157-imj848t0rko23tnfbd27g5b35vj28tkb.apps.googleusercontent.com"}).then(response =>{
//         const {email_verfied , name ,email} = response.payload;
//         console.log(response.payload);

//     })
// }
// // module.exports = googleLogin