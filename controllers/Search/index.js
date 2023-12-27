const axios = require('axios');
const Artists = require('../../models/artists')
const Services = require("../../models/services");

exports.getInitialData = async (_, res) => {

    try {

        const allArtists = await Artists.find({status:'active'});
    
        if (!allArtists || !Array.isArray(allArtists)) {
          return res.status(400).json({ error: 'Invalid Artists Data.' });
        }
    
        const cities = await Promise.all(
            allArtists.map(async ({ coords }) => {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${process.env.GOOGLE_MAP_API_KEY}`
            );
    
            const city = response.data.results[0].address_components.find(
              (component) => component.types.includes('locality')
            ).long_name;
    
            return city;
          })
        );
    
        // Count the occurrences of each city
        const cityCounts = cities.reduce((acc, city) => {
            acc[city] = (acc[city] || 0) + 1;
            return acc;
        }, {});
    
        // Convert the city counts to an array of objects
        const cityArray = Object.keys(cityCounts).map((city) => ({
            name: city,
            count: cityCounts[city],
        }));
    
        // Sort the array based on the count in descending order
        const sortedCities = cityArray.sort((a, b) => b.count - a.count);
        const distictCities = sortedCities.map((item)=> item.name);

        const allServices = await Services.find({status:'Active'});
        
        return res.status(200).json({ cities: distictCities, services:allServices });

      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}
