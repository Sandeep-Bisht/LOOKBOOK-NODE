const Bookings = require("../../models/cart");
const UserRole = require("../../models/user_roles")
const Role = require("../../models/roles")

exports.getAllBookings = async (req, res) => {

    try {
      
      const roleId = await UserRole.findOne({user_id:req.user._id}).select('role_id');
    
      if(!roleId || !roleId.role_id){
          return res.status(401).json({
                    error:true,
                    message:"Unautherized user role.",
                  })
      }

      const role = await Role.findById(roleId.role_id);

      if(!role || !role?.role){
        return res.status(401).json({
          error:true,
          message:"Unautherized user role.",
        })
      }

      if(!role?.role === 'user' && !role?.role === 'artist'){
        return res.status(401).json({
          error:true,
          message:"Unautherized user role.",
        })
      }

      const allBookings = await Bookings.find({user_id:req.user._id,status:'closed'}).populate({
        path: 'artist',
        populate: {
          path: 'profile',
          model: 'profile'
        }
      });

      return res.status(200).json(allBookings);

      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}
