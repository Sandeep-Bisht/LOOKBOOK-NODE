const { uploadFilesToImagekit } = require('../../config/upload');
const ArtistRequest = require('../../models/artist_requests');
const profiles = require('../../models/profile');
const UserRoles = require('../../models/user_roles')
const Role = require('../../models/roles')

exports.getArtistRequests = async (req, res) => {
    try{
        const userRoleId = await UserRoles.findOne({'user_id':req.user._id});

        if(!userRoleId){
          return res.status(400).json({
            error:true,
            message:"User role not found."
        })
        }

        const userRole = await Role.findById(userRoleId?.role_id);
        if(!userRole || !userRole?.role){
          return res.status(400).json({
            error:true,
            message:"User role not found."  
        })
        }

        if(userRole?.role === 'artist'){
          return res.status(400).json({
            error:true,
            artist:true,
            message:"Your request has been approved. You are artist now."
          })
        }

        if(!userRole?.role === 'user'){
          return res.status(400).json({
            error:true,
            message:"Unauthorized role."
          })
        }

        const existingRequest = await ArtistRequest.find({'user_id':req.user._id}).populate("profile");
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
      const userRoleId = await UserRoles.findOne({'user_id':req.user._id});

        if(!userRoleId){
          return res.status(400).json({
            error:true,
            message:"User role not found."
        })
        }

        const userRole = await Role.findById(userRoleId?.role_id);
        if(!userRole){
          return res.status(400).json({
            error:true,
            message:"User role not found."
        })
        }

        if(userRole === 'artist'){
          return res.status(400).json({
            error:true,
            artist:true,
            message:"Your request has been approved. You are artist now."
          })
        }

        if(!userRole === 'user'){
          return res.status(400).json({
            error:true,
            message:"Unauthorized role."
          })
        }

      var updateFields = {...req.body};
      var requestStatus = req.body?.status;
      delete updateFields.status;
      delete updateFields.mobile;
      delete updateFields.email;
      delete updateFields.certificates;

      // Find the document by user_id and status
      let existingRequest = await ArtistRequest.findOne({ 'user_id': req.user._id, 'status': 'progress' }).populate('profile');


      // updating request status for verification

      if(requestStatus && (requestStatus == 'pending' || requestStatus == 'progress')){
        if(requestStatus == 'progress'){
          updateFields['status'] = 'progress';
        }
        if(requestStatus == 'pending'){
          if(existingRequest){
            let existingRequestData = {...existingRequest._doc};
            
            if(existingRequestData.user_id.equals(req.user._id) && 
              existingRequestData.profile &&
              existingRequestData.userName && 
              existingRequestData.profile?.fullName && 
              existingRequestData.profile?.gender && 
              existingRequestData.profile?.dob && 
              existingRequestData.profile?.email && 
              existingRequestData.profile?.mobile && 
              existingRequestData.instagram && 
              existingRequestData.featuredCategory && 
              existingRequestData.categories.length > 0 && 
              existingRequestData.products.length > 0 && 
              existingRequestData.coords?.lat && existingRequestData.coords?.lng && 
              existingRequestData.gallery.length > 2 && 
              existingRequestData.description && 
              existingRequestData.pricing && 
              existingRequestData.adharFront && 
              existingRequestData.adharBack && 
              existingRequestData.panCard &&
              existingRequestData.currentStep > 14
              ){
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
        }
    }
  
      if (!existingRequest) {
      
        let profile = await profiles.findOne({'user_id': req.user._id});
        updateFields['user_id'] = req.user._id;
        updateFields['profile'] = profile._id;
  
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
      return res.status(500).json({
        error: true,
        message: "Something went wrong. Please try again later."
      });
    }
};

exports.addCertificates = async (req, res) => {
  try {
    const userRoleId = await UserRoles.findOne({'user_id':req.user._id});

      if(!userRoleId){
        return res.status(400).json({
          error:true,
          message:"User role not found."
      })
      }

      const userRole = await Role.findById(userRoleId?.role_id);
      if(!userRole){
        return res.status(400).json({
          error:true,
          message:"User role not found."
      })
      }

      if(userRole === 'artist'){
        return res.status(400).json({
          error:true,
          artist:true,
          message:"Your request has been approved. You are artist now."
        })
      }

      if(!userRole === 'user'){
        return res.status(400).json({
          error:true,
          message:"Unauthorized role."
        })
      }

      const existingRequest = await ArtistRequest.findOne({ 'user_id': req.user._id, 'status': 'progress' }).populate('profile');

      if(!existingRequest){
        return res.status(400).json({
          error:true,
          message:'No request in progess yet.',
        })
      }

      var {title, certificate} = req.body;

      if (req.files) {
        let fileUploadResponse = await uploadFilesToImagekit(req);

        if(fileUploadResponse && fileUploadResponse.length > 0){
          let certificateCopy = fileUploadResponse.find((item) => item.fieldName == 'certificate');
          if(certificateCopy) certificate = certificateCopy.response;
        }
      }

      if(title && certificate){
        const previousCertificates = existingRequest.certificates && Array.isArray(existingRequest.certificates) ? existingRequest.certificates : []; 

        previousCertificates.push({title,certificate});
        
        // Update the existing document`
        const updatedRequest = await ArtistRequest.findOneAndUpdate(
          { 'user_id': req.user._id, 'status': 'progress' },
          { $set: {certificates:previousCertificates} },
          { new: true }
        );
  
        return res.status(200).json({
          status: 200,
          message: "Request updated successfully",
          data: updatedRequest
        });

      }
      else{
        return res.status(400).json({
          error:true,
          message:'Bad request. Title and certificate are required.',
        })
      }
      
    }
      catch(error){
         res.status(500).json({
          error:true,
          message:"somthing went wrong please try again later."
         })
      }
}
  
exports.getAllArtistRequest = async (req,res) =>{
  try{
    ArtistRequest.find().populate('categories').populate('featuredCategory').populate('products').populate('profile').then((result)=>{
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
