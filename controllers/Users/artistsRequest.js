const { uploadFilesToImagekit } = require('../../config/upload');
const ArtistRequest = require('../../models/artist_requests');
const userRoles = require('../../models/user_roles')
const profiles = require('../../models/profile')

exports.getArtistRequests = async (req, res) => {
    try{
        const existingRequest = await ArtistRequest.find({'user_id':req.user._id}).populate("profile_id");
        return res.send(existingRequest);
        
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}

exports.updateArtistRequest = async (req, res) => {
    try {
      var updateFields = {...req.body};
      var requestStatus = req.body?.status;
      delete updateFields.status;

      // Find the document by user_id and status
      let existingRequest = await ArtistRequest.findOne({ 'user_id': req.user._id, 'status': 'progress' });


      // updating request status for verification

      if(requestStatus && (requestStatus == 'pending' || requestStatus == 'progress')){
        if(requestStatus == 'progress'){
          updateFields['status'] = 'progress';
        }
        if(requestStatus == 'pending'){
          if(existingRequest){
            let existingRequestData = {...existingRequest._doc};
            
            if(existingRequestData.user_id.equals(req.user._id) && existingRequestData.profile_id && existingRequestData.services.length > 0 && existingRequestData.products.length > 0 && existingRequestData.coords?.lat && existingRequestData.coords?.lng && existingRequestData.gallery.length > 2 && existingRequestData.description && existingRequestData.pricing && existingRequestData.adharFront && existingRequestData.adharBack && existingRequestData.panCard && existingRequestData.featuredService){
              let profile = await profiles.findOne({'user_id': req.user._id});
              let profileData = {...profile._doc}

              if(profileData.fullName && profileData.email && profileData.instaId && profileData.mobile && profileData.gender && profileData.dob && profileData.status == 'Active'){
                updateFields['status'] = 'pending';
              }
              else{
                return res.status(400).json({
                  status: 400,
                  message: "Please provide correct information."
                });
              }
            }
            else{
              return res.status(400).json({
                status: 400,
                message: "Please provide correct information."
              });
            }

          }
          else{
            return res.status(400).json({
              status: 400,
              message: "Please provide correct information."
            });
          }
        }
      }

      // end updating request status for verification

      if (req.files) {
        let fileUploadResponse = await uploadFilesToImagekit(req);
        if(fileUploadResponse && fileUploadResponse.length > 0){

          let adharFront = fileUploadResponse.find((item) => item.fieldName == 'adharFront');
          if(adharFront) updateFields = {...updateFields,adharFront:adharFront.response};

          let adharBack = fileUploadResponse.find((item) => item.fieldName == 'adharBack');
          if(adharBack) updateFields = {...updateFields,adharBack:adharBack.response};

          let panCard = fileUploadResponse.find((item) => item.fieldName == 'panCard');
          if(panCard) updateFields = {...updateFields,panCard:panCard.response};

          let galleryImages = fileUploadResponse.filter((item) => item.fieldName == 'gallery');

          if(galleryImages.length > 0){
            let galleryImagesResponse = [];
            if(!existingRequest){
              galleryImages.map((item) => galleryImagesResponse.push(item.response));
              updateFields = {...updateFields,gallery:galleryImagesResponse};
            }
            else{
              galleryImagesResponse = [...existingRequest.gallery]
              galleryImages.map((item) => galleryImagesResponse.push(item.response));
              updateFields = {...updateFields,gallery:galleryImagesResponse};
            }
          }

          let certificateImages = fileUploadResponse.filter((item) => item.fieldName == 'certificates');

          // He can upload pdf also
          
          if(certificateImages.length > 0){
            let certificateImagesResponse = [];
            if(!existingRequest){
              certificateImages.map((item) => certificateImagesResponse.push(item.response));
              updateFields = {...updateFields,certificates:certificateImagesResponse};
            }
            else{
              certificateImagesResponse = [...existingRequest.certificates]
              certificateImages.map((item) => certificateImagesResponse.push(item.response));
              updateFields = {...updateFields,certificates:certificateImagesResponse};
            }
          }
        }
    }
  
      if (!existingRequest) {
      
        let profile = await profiles.findOne({'user_id': req.user._id});
        updateFields['user_id'] = req.user._id;
        updateFields['profile_id'] = profile._id;
  
        ArtistRequest.create(updateFields)
          .then((result) => {
            if (result) {
              return res.status(201).json({
                status: 201,
                message: "Request created successfully",
                data: result
              });
            } else {
              return res.status(400).json({
                status: 400,
                message: "Please provide correct information"
              });
            }
          })
          .catch((error) => {
            return res.status(400).json({
              status: 400,
              message: "Please provide correct information"
            });
          });
      } else {
        // check artist request is pending

        let pendingRequest = await ArtistRequest.findOne({ 'user_id': req.user._id, 'status': 'pending' });
        if(pendingRequest){
          return res.status(400).json({
            error:true,
            message:'Your request is still pending. You can raise a request if your request is cancelled or not started.',
          })
        }
        else{

        // Update the existing document`
        existingRequest = await ArtistRequest.findOneAndUpdate(
          { 'user_id': req.user._id, 'status': 'progress' },
          { $set: updateFields },
          { new: true }
        );
  
        return res.status(200).json({
          status: 200,
          message: "Request updated successfully",
          data: existingRequest
        });
        }
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: "Something went wrong. Please try again later."
      });
    }
};
  
exports.getAllArtistRequest = async (req,res) =>{
  try{
    ArtistRequest.find().populate('services').populate('products').populate('profile_id').then((result)=>{
      if(result!=null)
      {
        res.status(200).json({
          error:false,
          message:"Get All Artist",
          data:result,
        })
      }
      else{
        res.status(400).json({
          error:true,
          message:"Data not found",
        })
      }
    })
  }catch(error){
      res.status(500).json({
      error: true,
      message: "Something went wrong. Please try again later."
    });
  }
}
