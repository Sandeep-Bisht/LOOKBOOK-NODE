require('dotenv').config();
var jwt = require('jsonwebtoken');
let users = require('../../models/Users');
const axios = require('axios');
const createNewUser = require('../../services/createNewUser')

exports.facebookSignup = (req, res) => {
    try{
        const { userID, accessToken } = req.body

        if(userID && accessToken){
            // https://graph.facebook.com/me?access_token=${accessToken}
              axios.get(`https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`)
              .then((response) => {
                if (response.status === 200) {
                  const userData = response.data;
                  users.findOne({facebookID: userData.id })

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
    
                        let newUserData = {
                          user:{usertype:'facebook',facebookID: userData.id},
                          role:'user',
                          profile:{fullName:userData.name,usertype:'facebook'}
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

                } else {
                    return res.status(response.status).json({
                        error:true,
                        message:"Unexpected response status."
                    })
                }
              })
              .catch((error) => {
                if (error.response) {
                    return res.status(error.response.status).json({
                        error:true,
                        message:"Unable to get User data from facebook."
                    })
                } else {
                    return res.status(400).json({
                        error:true,
                        message: "Error finding user on facebook.",
                      });
                }
              });

        }
        else{
            res.status(400).json({
                error:true,
                message:"User access token and UserId required."
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
