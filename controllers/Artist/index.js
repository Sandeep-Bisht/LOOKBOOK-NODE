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

exports.getByID = async (req, res) => {
    try{
        const {artist_id}  = {...req.params}
        const artist = await Artists.findById(artist_id).populate('profile_id').populate('services').populate('products');
        return res.status(200).json(artist);
    }
    catch(err){
        res.status(404).json({
            error:true,
            message:"No Artist found with this ID."
        })
    }
}