require('dotenv').config();
const Profile = require('../models/profile'); // Import your Profile model

const updateProfile = async (data) => {
  try {

    const { user, profile } = data;

    const existingProfile = await Profile.findOne({'user_id':user._id});

    if(!existingProfile){
      return {
        error: true,
        status: 500,
        message: 'User not found in profile.',
      };
    }

    const profileResult = await Profile.findOneAndUpdate({_id:existingProfile._id},{$set:profile}, { new: true });

    if (!profileResult) {
      return {
        error: true,
        status: 500,
        message: 'Error updating profile.',
      };
    }

    return {
      error: false,
      status: 200,
      message: 'profile updated successfully!',
    };
    
  } catch (error) {
    return {
      error: true,
      errorMessage:error.message,
      status: 500,
      message: 'Error updating profile.',
    };
  }
};

module.exports = updateProfile;
