var jwt = require('jsonwebtoken');
let users = require('../../models/Users');
const { OAuth2Client } = require('google-auth-library');
const createNewUser = require('../../services/createNewUser')
const UserRoles = require('../../models/user_roles')
const Profile = require('../../models/profile')

// initialize oathclient
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID || "Checkyourenvfile",
    process.env.GOOGLE_CLIENT_SECRET || "Checkyourenvfile",
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
                  .then(async(result)=>{
                    if(result){
                        try{
                            let roleId = await UserRoles.findOne({ user_id: result._id });
                            let userProfile = await Profile.findOne({ user_id: result._id });
                            let token = jwt.sign({userID:result._id,role:roleId.role_id,fullName:userProfile.fullName},process.env.JWT_KEY,{ expiresIn: "30d" })
                            return res.status(200).json({
                                              error: false,
                                              token: token,
                                              message: "User logged in successfully!",
                                            });
                          }
                          catch(error){
                            res.status(400).json({
                              error:true,
                              message: "Error Creating user token.",
                            });
                          }
                    }
                    else{

                        let newUserData = {
                          user:{email: userData.email},
                          role:'user',
                          profile:{fullName:userData.name,email: userData.email}
                        }

                        createNewUser(newUserData).then((response)=>{
                            return res.status(response.status).json(response);
                        })
                        .catch((error)=>{
                          res.status(400).json({
                            error:true,
                            message: "Error creating new user.",
                          });
                        })
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
