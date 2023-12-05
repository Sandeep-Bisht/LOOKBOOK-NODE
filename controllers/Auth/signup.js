require('dotenv').config();
var jwt = require('jsonwebtoken');
let users = require('../../models/Users');
const nodemailer = require("nodemailer");
const NodeCache = require('node-cache');
const Cache = new NodeCache();
const sendOTP = require('../../config/sendOTP');
const createNewUser = require('../../services/createNewUser')

exports.signup = async (req, res) => {
    try{
        let { username } = req.body
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(username){
            if(/^[0-9]{10}$/.test(username) || emailRegex.test(username)){
                
            const otp = Math.floor(111111 + Math.random() * 999999); 
            Cache.set(username, otp, 300);  //store otp for 300 seconds in catch

            if(await Cache.get(username)){
                if(/^[0-9]{10}$/.test(username)){
                    sendOTP('62385ab87f0231333a04e445', otp, username).then((message) => {
                        return res.status(200).json({
                            error:false,
                            "message":"OTP send successfully."
                        })
                    })
                    .catch((error) => {
                        return res.status(500).json({
                            error:true,
                            message:"Error sending otp."
                        })
                    });
            }

            if(emailRegex.test(username)){
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    port: 587,
                    auth: {
                      user: "nick976055@gmail.com",
                      pass: "Giks@123",
                    },
                  });
        
                  const mailOptions = {
                    from: "nick976055@gmail.com",
                    to: username,
                    subject: "OTP for Login",
                    html: `<p>Your OTP is ${otp}. It is valid for 5 minutes.</p>`,
                  };
        
                   transporter.sendMail(mailOptions,(err,info)=>{
                    if (err) {
                        return res.status(500).json({
                            err,
                            error:true,
                            message: "Error sending mail.",
                          });
                      } else {
                        return res.status(200).json({
                            error:false,
                            "message":"OTP send successfully."
                        })
                      }
                   });
            }

            }
            else{
                    res.status(400).json({
                      error:true,
                      message: "Something went wrong while generating OTP.",
                    });
    
            }
        }
        else{
            return res.status(400).send("Invalid username.")
        }
      
        }
        else{
            res.status(400).json({
                error:true,
                message:"Username required."
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

exports.signupVerify = async(req,res) => {
    try{
        let { username, otp } = req.body
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if(!otp || !username){
           return res.status(400).json({
                error:true,
                message:"Username and otp is required."
            })
        }

        if(!(/^[0-9]{10}$/.test(username) || emailRegex.test(username))){
            return res.status(400).json({
                error:true,
                message:"Invalid username.."
            })
        }

        const cachedOTP = Cache.get(username);

        if (otp && cachedOTP == otp && cachedOTP) {
            Cache.del(username); // Remove the OTP from the cache to prevent further use

            users.findOne({
                $or: [
                  { email: username },    // Check for duplicate email
                  { mobile: username }  // Check for duplicate mobile
                ]
              })
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
                    let userData = {};

                    if(emailRegex.test(username)){
                        userData.usertype = 'email';
                        userData.email = username;
                    }
                    else{
                        userData.usertype = 'mobile';
                        userData.mobile = username;
                    }
                    
                    let newUserData = {
                        user:userData,
                        role:'user',
                        profile:userData
                      }
        
                    createNewUser(newUserData).then((response)=>{
                        return res.status(response.status).json(response);
                    })
                    .catch((error)=>{
                      res.status(400).json({
                        error:true,
                        message: "Error creating new user.",
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
            return res.status(401).json({
                error:true,
                message:"Invalid otp."
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