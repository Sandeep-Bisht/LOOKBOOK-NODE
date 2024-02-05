const ArtistRequest = require('../../../models/artist_requests');
const AllServices = require('../../../models/services');
const AllUsers = require('../../../models/Users');
const AllBlogs = require('../../../models/blog');
const Artists = require('../../../models/artists');

exports.getAdminDashboardInitialData = async (req, res) => {
  try {

       const artistRequestCount = await ArtistRequest.countDocuments({ status: 'pending' });   
       const pendingArtist = await ArtistRequest.find().populate('services').populate("profile_id");
       const artistRejectCount = await ArtistRequest.countDocuments({ status: 'reject' });
       const servicesCount = await AllServices.countDocuments();
       const usersCount = await AllUsers.countDocuments();
       const blogsCount = await AllBlogs.countDocuments();
       const artistsCount = await Artists.countDocuments();
       const featuredArtistsCount = await Artists.countDocuments({ featuredTag: true });
       const emergingArtistsCount = await Artists.countDocuments({ emergingTag: true });
       const featuredArtists = await Artists.find({ featuredTag: true }).populate("services").populate("profile_id");
       const emergingArtists = await Artists.find({ emergingTag: true }).populate("services").populate("profile_id");
  
       const allArtists = await Artists.find({status : 'active'});
        
       // Create a map to store the count of artists for each state and country
       const stateCountsMap = new Map();
       
       // Iterate through each artist and update the map
       allArtists.forEach(artist => {
           const state = artist.address && artist.address.state;
           const country = artist.address && artist.address.country;
           if (state) {
               const key = `${country}-${state}`; // Use a combination of country and state as the key
               stateCountsMap.set(key, (stateCountsMap.get(key) || 0) + 1);
           }
       });
       
       // Convert the map to an array of objects
       const artistsPerState = Array.from(stateCountsMap.entries()).map(([key, count]) => {
           const [country, stateName] = key.split('-');
           return {
               country,
               stateName,
               count
           };
       });
       
      
    const data = {
      totalArtistRequest : artistRequestCount + artistsCount + artistRejectCount,
      artistRejectCount,
      artistRequestCount,
      servicesCount,
      usersCount,
      blogsCount,
      artistsCount,
      featuredArtistsCount,
      featuredArtists,
      pendingArtist,
      emergingArtistsCount,
      emergingArtists,
      artistsPerState // Call toArray() here
    
    };


    res.status(200).json({
      error: false,
      message: "Admin Dashboard Initial Data",
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: true,
      message: "Internal server error",
    });
  }
};
