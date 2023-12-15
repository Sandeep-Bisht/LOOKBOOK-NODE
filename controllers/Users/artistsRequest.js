require('dotenv').config();
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
      const updateFields = req.body;
  
      // Find the document by user_id and status
      let existingRequest = await ArtistRequest.findOne({ 'user_id': req.user._id, 'status': 'progress' });
  
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
    ArtistRequest.find().then((result)=>{
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