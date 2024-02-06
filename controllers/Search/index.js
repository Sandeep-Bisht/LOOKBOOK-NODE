const Artists = require('../../models/artists')
const Services = require("../../models/services");
const mongoose = require('mongoose')

exports.getInitialData = async (_, res) => {

    try {

        const distinctCities = await Artists.distinct('address.city', { status: 'active', 'address': { $exists: true, $ne: null } });
        
        const allServices = await Services.find({status:'Active'}).select('title icon slug');
        
        return res.status(200).json({ cities: distinctCities, services:allServices });

      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}

exports.findArtist = async (req, res) => {
    
  const  {location, dates, service } = req.query;
    
    try {

      if(!location && !dates && !service){
        return res.status(400).json({ error: 'Invalid Data.' });
      }

      let query = { status: 'active' }; 
  
      // Build the query based on the provided parameters
      if (location) {
        query['address.city'] = location;
      }
  
      if (service) {
        if (mongoose.isValidObjectId(service)) {
          query['services'] = new mongoose.Types.ObjectId(service);
        } else {
          return res.status(400).json({ error: 'Invalid service ID.' });
        }
      }
  
      const foundArtists = await Artists.find(query).populate('profile_id').exec();
  
      if (foundArtists.length > 0) {
        res.status(200).json(foundArtists);
      } else {
        res.status(404).json({ error: 'Artists not found.' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

