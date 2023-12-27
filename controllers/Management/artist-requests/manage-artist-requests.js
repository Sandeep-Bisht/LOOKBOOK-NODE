const ArtistRequest = require('../../../models/artist_requests');
const userRoles = require('../../../models/user_roles')
const Artists = require('../../../models/artists')
const Joi = require('joi');

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
        let userRole = await userRoles.findOne({'user_id':req.user._id});

        if(userRole.role_id.equals(process.env.ROLE_ADMIN)){

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

                        const keysToCopy = ['user_id', 'profile_id','services','products','coords','travel','experience','education','languages','gallery','description','pricing','adharFront','adharBack','panCard','certificates'];
                    
                        const newObject = {};

                        keysToCopy.forEach((key) => {
                            if (existingRequest._doc.hasOwnProperty(key)) {
                                newObject[key] = existingRequest._doc[key];
                            }
                        });

                        const newArtist = new Artists(newObject);
                        const result = await newArtist.save();

                        await userRoles.findOneAndUpdate(
                            {'user_id': result.user_id},
                            { $set: {'role_id':process.env.ROLE_ARTIST} },
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
        // const existingRequest = await ArtistRequest.find({'user_id':req.user._id});
        // return res.send(existingRequest);
        
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
        let userRole = await userRoles.findOne({'user_id':req.user._id});

        if(userRole.role_id.equals(process.env.ROLE_ADMIN)){

        const request_id = req.params.request_id;
        const request = await ArtistRequest.findById(request_id).populate('services').populate('products').populate('profile_id');
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
        console.error(err);
        return res.status(500).json({
          error: true,
          message: "Something went wrong. Please try again later."
        });
    }

}

