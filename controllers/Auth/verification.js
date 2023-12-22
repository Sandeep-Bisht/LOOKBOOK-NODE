require('dotenv').config();
const sendOTP = require('../../config/sendOTP');
const nodemailer = require("nodemailer");
const NodeCache = require('node-cache');
const Cache = new NodeCache();

exports.sendotp = async (req, res) => {
    try{
        let { value } = req.body
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if(value){
            if(/^[0-9]{10}$/.test(value) || emailRegex.test(value)){
                
            var otp = Math.floor(100000 + Math.random() * 900000);
            otp = otp.toString();
            Cache.set(`verify-${value}`, otp, 300);  //store otp for 300 seconds in catch

            if(await Cache.get(`verify-${value}`)){
                if(/^[0-9]{10}$/.test(value)){
                    sendOTP('62385ab87f0231333a04e445', otp, value).then((message) => {
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

            if(emailRegex.test(value)){
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
                    to: value,
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
            return res.status(400).send("Invalid value.")
        }
      
        }
        else{
            res.status(400).json({
                error:true,
                message:"value required."
            })
        }
    }
    catch(err){
        res.status(500).json({
            error:true,
            errorMessage:err.message,
            message:"Something went wrong please try again later."
        })
    }
}


exports.verifyOtp = async(req,res) => {
    try{
        let { value, otp } = req.body
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;

        if(!otp || !value){
           return res.status(400).json({
                error:true,
                message:"value and otp is required."
            })
        }

        if(!(/^[0-9]{10}$/.test(value) || emailRegex.test(value))){
            return res.status(400).json({
                error:true,
                message:"Invalid value.."
            })
        }

        const cachedOTP = Cache.get(`verify-${value}`);

        if (otp && cachedOTP == otp && cachedOTP) {
            Cache.del(`verify-${value}`); // Remove the OTP from the cache to prevent further use
            
            return res.status(200).json({
                error:false,
                message:"OTP verified successfully."
            })

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