require('dotenv').config();
var jwt = require('jsonwebtoken');
let users = require('../../models/Users');
const { OAuth2Client } = require('google-auth-library');

// initialize oathclient
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'postmessage',
);

exports.googleSignup = async (req, res) => {
    try{
        const { code } = req.body
        if(code){
            const { tokens } = await oAuth2Client.getToken(code);
            
            if(tokens.id_token){
                const userData = jwt.decode(tokens.id_token);
                users.findOne({email: userData.email })
                  .then((result)=>{
                    if(result){
                        let token = jwt.sign({userID:result._id},process.env.JWT_KEY,{ expiresIn: "30d" })
                        return res.status(200).json({
                                          error: false,
                                          token: token,
                                          message: "User logged in successfully!",
                                        });
                    }
                    else{
                        let newUserData = {usertype:'google',email: userData.email};
    
                        users.create(newUserData)
                        .then((result) => {
                          if (result) {
            
                            let token = jwt.sign({userID:result._id},process.env.JWT_KEY,{ expiresIn: "30d" })
            
                            return res.status(200).json({
                              error: false,
                              token: token,
                              message: "User created successfully!",
                            });
                          }
                        })
                        .catch((error) => {
                            res.status(400).json({
                              error:true,
                              message: "Error Creating new user.",
                            });
                        });
                    }
                  })
                  .catch((err)=>{
                    res.status(400).json({
                        error:true,
                        message: "Error Finding user.",
                      });
                  });
            }
            else{
                res.status(400).json({
                    error:true,
                    message:"Error finding user token."
                })
            }
        }
        else{
            res.status(400).json({
                error:true,
                message:"User Google code is required."
            })
        }
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}
