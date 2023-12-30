const Wishlist = require("../../models/wishlist");

module.exports={
  
    create: async (req, res) => {
        try {
          let { artist_id } = req.body;
      
          await Wishlist.findOne({ 'user_id': req.user._id })
            .then(async (result) => {
              if (result !== null) {
                // Check if the artist_id is not already in the array
                if (!result.artist.includes(artist_id)) {
                  // Push the artist_id to the artist array
                  result.artist.push(artist_id);
                  await Wishlist.findOneAndUpdate(
                    { 'user_id': req.user._id },
                    { $set: { artist: result.artist } },
                    { new: true }
                  ).then((updatedResult) => {
                    res.status(200).json({
                      error: false,
                      message: "Artist wishlisted successfully.",
                      data: updatedResult // Use updatedResult instead of res
                    });
                  });
                } else {
                    let updatedArtists = [...result.artist].filter( item => !item.equals(artist_id));
                    await Wishlist.findOneAndUpdate(
                      { 'user_id': req.user._id },
                      { $set: { artist: updatedArtists } },
                      { new: true }
                    ).then((updatedResult) => {
                      res.status(200).json({
                        error: false,
                        message: "Artist remved from wishlist successfully.",
                        data: updatedResult // Use updatedResult instead of res
                      });
                    });
                }
              } else {
                Wishlist.create({ 'user_id': req.user._id, 'artist': [artist_id] }).then((newResult) => {
                  if (newResult) {
                    res.status(200).json({
                      error: false,
                      message: "Wishlist created successfully",
                      data: newResult
                    });
                  } else {
                    res.status(400).json({
                      error: true,
                      message: "Please provide correct information"
                    });
                  }
                });
              }
            })
            .catch((error) => {
              res.status(400).json({
                error: true,
                message: "Please provide correct information"
              });
            });
        } catch (error) {
          res.status(500).json({
            error: true,
            message: 'Internal server error'
          });
        }
      },
       

  get_user_wishlist_by_id: async (req, res) => {
    try {  
      await Wishlist.findOne({'user_id':req.user._id}).then((result)=>
      {
        if (result !== null) {
          res.status(200).json({
            error: false,
            message: "Data found",
            data: result,
          });
        } else {
          res.status(404).json({
            error: true,
            message: "Data not found",
          });
        }
      } ) 
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  },


}