const Profile = require('../../models/profile');
const Joi = require('joi');

exports.getAddresses = async (req, res) => {
    try {
        const allAddresses = await Profile.findOne({ 'user_id': req.user._id }).select('address');
        return res.status(200).json(allAddresses);
    }
    catch (err) {
        res.status(500).json({
            error: true,
            message: "Something went wrong please try again later."
        })
    }
}

exports.addAddress = async (req, res) => {
    try {

        const requiredSchema = Joi.object({
            address: Joi.string().required(),
            city: Joi.string().required(),
            country: Joi.string().required(),
            fullName: Joi.string().required(),
            landmark: Joi.string().required(),
            mobile: Joi.number()
                .required()
                .integer()
                .min(1000000000) // Minimum 10-digit number
                .max(9999999999), // Maximum 10-digit number
            postalCode: Joi.number().required(),
            state: Joi.string().required(),
            street: Joi.string().required(),
            coords: Joi.object({
                lat: Joi.number().required(),
                lng: Joi.number().required()
            }).required(),
        });

        const validateRequest = await requiredSchema.validate({ ...req.body });

        if (validateRequest.error) {
            return res.status(400).send(validateRequest.error)
        }

        const address = [{ ...req.body }]; // Assuming addresses are sent in the request body as an array
        const profile = await Profile.findOneAndUpdate(
            { 'user_id': req.user._id },
            { $push: { address: { $each: address } } }, // Using $push to add multiple addresses
            { new: true }
        ).select('address');

        return res.status(200).json(profile.address);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: "Something went wrong please try again later."
        });
    }
}