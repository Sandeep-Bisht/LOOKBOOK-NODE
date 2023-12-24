const { uploadFilesToImagekit } = require('../../config/upload');
const ArtistRequest = require('../../models/artist_requests');

exports.getArtistRequests = async (req, res) => {
    try{
        const existingRequest = await ArtistRequest.find({'user_id':req.user._id});
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
      // Find the document by user_id and status
      let existingRequest = await ArtistRequest.findOne({ 'user_id': req.user._id, 'status': 'progress' });

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
        // If the document is not found, create a new one
        updateFields['user_id'] = req.user._id;
  
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
        // Update the existing document
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
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        error: true,
        message: "Something went wrong. Please try again later."
      });
    }
};
  
exports.updateArtistRequestStatus = async (req, res) => {
    try {
        const status = req.params.status;
  
      // Find the document by user_id and status
      let existingRequest = await ArtistRequest.findOneAndUpdate(
        { 'user_id': req.user._id, 'status': 'progress' },
        { $set: {'status':status} },
        { new: true }
      );
  
      if (!existingRequest) {

        return res.status(400).json({
            status: 400,
            message: "No open request found."
          });

      } 

      return res.status(200).json({
        error: true,
        message: "Request status updated successfully.",
        data:existingRequest
      });

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
    ArtistRequest.find().populate('services').populate('products').then((result)=>{
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
