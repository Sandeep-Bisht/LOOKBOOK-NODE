const Artists = require('../../models/artists')

exports.getAll = async (req, res) => {
    try{
        const allArtists = await Artists.find({status:'active'}).populate('profile_id');
        return res.status(200).json(allArtists);
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}