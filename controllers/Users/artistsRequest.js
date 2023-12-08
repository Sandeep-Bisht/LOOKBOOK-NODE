require('dotenv').config();
const { uploadFilesToImagekit } = require('../../config/upload');
const ArtistRequest = require('../../models/artist_requests');

exports.getArtistRequests = async (req, res) => {
    try{
        const existingRequest = await ArtistRequest.findOne({'user_id':req.user._id});
        return res.send(existingRequest);
        
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}