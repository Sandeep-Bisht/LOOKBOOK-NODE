require('dotenv').config();
const { uploadFilesToImagekit } = require('../../config/upload');
const Profile = require('../../models/profile');
const updateProfile = require('../../services/updateProfile');
const UserRoles = require('../../models/user_roles')

exports.setProfile = async (req, res) => {
    try{
        var data = {...req.body}

        if (req.files) {
            let fileUploadResponse = await uploadFilesToImagekit(req);
            if(fileUploadResponse && fileUploadResponse.length > 0){
              let image = fileUploadResponse.find((item) => item.fieldName == 'image');
              if(image) data = {...data,image:image.response};
            }
        }

        updateProfile({user:req.user,profile:data}).then((response)=>{
            return res.status(response.status).json(response);
        })
        .catch((error)=>{
          res.status(400).json({
            error:true,
            errorMessage:error.message,
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
        const role = await UserRoles.findOne({'user_id':req.user._id});
        return res.send({...existingProfile._doc,role:role.role_id});
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}