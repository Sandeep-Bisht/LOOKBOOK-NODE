const ArtistRequest = require('../../../models/artist_requests');
const userRoles = require('../../../models/user_roles')
const Role = require('../../../models/roles')
const Artists = require('../../../models/artists')
const Services = require('../../../models/services')
const KYC = require('../../../models/kyc')
const Joi = require('joi');
const { default: axios } = require('axios');

const requiredSchema = Joi.object({
    status: Joi.string().valid('approved', 'rejected').required(),
    request_id: Joi.string().required(),
    remark: Joi.when('status', {
        is: 'rejected',
        then: Joi.string().required(),
        otherwise: Joi.string().allow(''), // Allow an empty string when status is not 'rejected'
      }),
});
  


exports.verifyRequest = async (req, res) => {
    try{
        const userRole = await userRoles.findOne({'user_id':req.user._id});

        if(!userRole || !userRole?.role_id){
          return res.status(401).json({
              error:true,
              message:"unauthorized role."
          })
        }

        const role = await Role.findById(userRole?.role_id);
        const artistRoleId = await Role.findOne({'role':'artist'});

        if(role && artistRoleId && artistRoleId?._id && role?.role === 'admin'){

            const validateRequest = await requiredSchema.validate({...req.body});

            if(validateRequest.error){
                return res.status(400).send(validateRequest.error)
            }
            else{
                let payload = validateRequest.value;

                try{
                    if(payload.status == 'rejected'){
                        let existingRequest = await ArtistRequest.findOneAndUpdate(
                            {'_id': payload.request_id},
                            { $set: payload },
                            { new: true }
                          );
                    
                          return res.status(200).json({
                            status: 200,
                            message: "Request updated successfully",
                            data: existingRequest
                          });
                    }

                    if(payload.status == 'approved'){
                        let existingRequest = await ArtistRequest.findById(payload.request_id);

                        const keysToCopy = ['user_id', 'userName', 'instagram', 'profile','categories','products', 'featuredCategory', 'coords','travel','experience','education','languages','gallery','description','certificates','pricing'];
                    
                        const newObject = {};

                        keysToCopy.forEach((key) => {
                            if (existingRequest._doc.hasOwnProperty(key)) {
                                newObject[key] = existingRequest._doc[key];
                            }
                        });

                        const FindAddress = await axios.get( `https://maps.googleapis.com/maps/api/geocode/json?latlng=${existingRequest.coords.lat},${existingRequest.coords.lng}&key=${process.env.GOOGLE_MAP_API_KEY || "Checkyourenvfile"}`);

                        if (FindAddress.data.status === 'OK') {
                             const addressResult = FindAddress.data.results;
                             if (addressResult.length > 0) {
                                const addressComponents = addressResult[0].address_components;

                                let city, state, country, postalCode ;

                                for (const component of addressComponents) {
                                    if (component.types.includes('locality')) {
                                      city = component.long_name;
                                    } else if (component.types.includes('administrative_area_level_1')) {
                                      state = component.long_name;
                                    } else if (component.types.includes('country')) {
                                      country = component.long_name;
                                    } else if (component.types.includes('postal_code')) {
                                      postalCode = component.long_name;
                                    }
                                }

                                newObject['address'] = {city, state, country, postalCode};

                            }
                            else{
                                newObject['address'] = {city:null, state:null, country:null, postalCode:null};
                            }
                        }
                        else{
                            newObject['address'] = {city:null, state:null, country:null, postalCode:null};
                        }

                        var allServices = await Services.find({ 'artist_category': { $in: newObject['categories'] } }).select('title icon');

                        if(allServices && Array.isArray(allServices) && allServices.length > 0) {
                            const promise = allServices.map((item) => {
                                return { ...item, pricing: { ...(existingRequest?.pricing), sessionTime: 3 } };
                            });
                            newObject['services'] = Promise.all(promise);
                        }
                        
                        // return;
                        // let artistServices = []

                        // if(Array.isArray(newObject['categories'])){
                        //   let allServices = await Services.find({ 'artist_category': { $in: newObject['categories'] } });
                        //   if(allServices){
                        //     allServices.map((item) => artistServices.push({...item,pricing:{...newObject['pricing']},'sessionTime':3}))
                        //   }else{
                        //     artistServices.push({'title':"Makeup",pricing:{...newObject['pricing']},'sessionTime':3})
                        //   }
                        // }
                        // else{
                        //   artistServices.push({'title':"Makeup",pricing:{...newObject['pricing']},'sessionTime':3})
                        // }


                        
                        // newObject['services'] = artistServices;

                        const KYCDocs = new KYC({adharFront:existingRequest.adharFront, adharBack:existingRequest.adharBack, panCard:existingRequest.panCard});
                        const KYCID = await KYCDocs.save();
                        newObject['kyc'] = KYCID._id;

                        const newArtist = new Artists(newObject);
                        const result = await newArtist.save();

                        await userRoles.findOneAndUpdate(
                            {'user_id': result.user_id},
                            { $set: {'role_id': artistRoleId?._id } },
                            { new: true }
                          );

                        await ArtistRequest.deleteMany({'user_id': result.user_id});

                        return res.status(200).json({
                            status: 200,
                            message: "Request approved successfully.",
                            data: result
                          });
                    }

                }
                catch(error){
                    return res.status(400).json({
                        error:true,
                        error_message:error.message || "request_id can't match",
                        message:"request not found."
                    })
                }
            }
        }
        else{
            res.status(401).json({
                error:true,
                message:"unauthorized role."
            })
        }
    }
    catch(err){
        res.status(500).json({
            error:true,
            err,
            message:"Something went wrong please try again later."
        })
    }
}

exports.artistRequestById = async (req,res) =>{

    try{
        const userRole = await userRoles.findOne({'user_id':req.user._id});

        if(!userRole || !userRole?.role_id){
          return res.status(401).json({
            error:true,
            message:"unauthorized role."
        })
        }

        const role = await Role.findById(userRole?.role_id);

        if(!role || !role?.role){
          return res.status(401).json({
            error:true,
            message:"unauthorized role."
        })
        }

        if(role?.role === 'admin'){

        const request_id = req.params.request_id;
        const request = await ArtistRequest.findById(request_id).populate('categories').populate('products').populate('profile').populate('featuredCategory');
        return res.status(200).json(request);
        }
        else{
            return res.status(401).json({
                error:true,
                message:"unauthorized role."
            })
        }
    }
    catch(err){
        return res.status(500).json({
          error: true,
          message: "Something went wrong. Please try again later."
        });
    }

}

exports.markFeaturedArtist = async (req, res) => {
    try {
      const payload = req.body;
      let { request_id, featuredTag } = payload;  
      // Use await here to wait for the result of the query
      let updatedArtist = await Artists.findOneAndUpdate(
        { _id: request_id }, // Assuming _id is of type ObjectId
        { $set: { featuredTag: featuredTag } },
        { new: true }
      );
  
      // Check if the artist is found
      if (updatedArtist) {
        res.status(200).json({
          error: false,
          message: "Artist marked as featured successfully.",
          data: updatedArtist,
        });
      } else {
        res.status(404).json({
          error: true,
          message: "Artist not found with the specified ID.",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };

  exports.markEmergingArtist = async (req, res) => {
    try {
      const payload = req.body;
      let { request_id, emergingTag } = payload;  
      // Use await here to wait for the result of the query
      let updatedArtist = await Artists.findOneAndUpdate(
        { _id: request_id }, // Assuming _id is of type ObjectId
        { $set: { emergingTag: emergingTag } },
        { new: true }
      );
  
      // Check if the artist is found
      if (updatedArtist) {
        res.status(200).json({
          error: false,
          message: "Artist marked as emerging artist successfully.",
          data: updatedArtist,
        });
      } else {
        res.status(404).json({
          error: true,
          message: "Artist not found with the specified ID.",
        });
      }
    } catch (error) {
      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  };

