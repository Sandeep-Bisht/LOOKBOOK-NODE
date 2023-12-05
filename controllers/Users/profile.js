require('dotenv').config();
const Profile = require('../../models/profile');
const updateProfile = require('../../services/updateProfile');

exports.setProfile = async (req, res) => {
    try{
        updateProfile({user:req.user,profile:req.body}).then((response)=>{
            return res.status(response.status).json(response);
        })
        .catch((error)=>{
          res.status(400).json({
            error:true,
            message: "Error updating profile.",
          });
        });

        
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}

exports.getProfile = async (req, res) => {
    try{
        const existingProfile = await Profile.findOne({'user_id':req.user._id});
        return res.send(existingProfile);
        
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}