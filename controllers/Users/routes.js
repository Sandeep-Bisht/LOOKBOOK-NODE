const passport = require("passport")
const router = require("express").Router()
const UserRoles = require('../../models/user_roles')

const { setProfile, getProfile } = require('./profile')
const { getArtistRequests, updateArtistRequest, getAllArtistRequest, addCertificates } = require('./artistsRequest')
const { upload, uploadFilesToImagekit } = require("../../config/upload")

router.post('/setProfile',passport.authenticate('jwt',{session:false}),upload.any('files'),setProfile)
router.get('/getProfile',passport.authenticate('jwt',{session:false}),getProfile)

router.get('/getArtistRequests',passport.authenticate('jwt',{session:false}),getArtistRequests)
router.post('/updateArtistRequest',passport.authenticate('jwt',{session:false}),upload.any('files'),updateArtistRequest)
router.post('/artist-request/addCertificates',passport.authenticate('jwt',{session:false}),upload.any('files'),addCertificates)
router.get('/getAllArtistRequest',passport.authenticate('jwt',{session:false}),getAllArtistRequest)

router.post('/uploadDocument',passport.authenticate('jwt',{session:false}),upload.any('files'),async (req,res)=>{
try{
    const userRoleId = await UserRoles.findOne({'user_id':req.user._id});

    if(!userRoleId){
      return res.status(400).json({
        error:true,
        message:"User role not found."
    })
    }

    if (req.files) {
        let fileUploadResponse = await uploadFilesToImagekit(req);
        return res.status(200).json(fileUploadResponse);
    }

    return res.status(400).json({
        error:true,
        message:"No File Found to upload."
    })

    }
catch(error){
    return res.status(500).json({
        error:true,
        message:"somthing went wrong please try again later."
       })
}
}
)


module.exports = router