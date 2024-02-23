const Cart = require("../../models/cart");
const mongoose = require('mongoose')
const UserRole = require("../../models/user_roles")
const Role = require("../../models/roles")
const Joi = require('joi');

exports.getCartData = async (req, res) => {

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

      const cartData = await Cart.find({user_id:req.user._id, status:'open'}).populate({
        path: 'artist',
        populate: {
          path: 'profile',
          model: 'profile'
        }
      });

      return res.status(200).json(cartData);

      } catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
      }
}

exports.addCart = async (req, res) => {

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

      const requiredSchema = Joi.object({
        artist: Joi.string().required(),
        service: Joi.object().required(),
        date:Joi.string().required(),
        sessions:Joi.number().required(),
        time:Joi.array().required(),
      });

      const validateRequest = await requiredSchema.validate({...req.body});

      if(validateRequest.error){
        return res.status(400).send(validateRequest.error)
      }

      const newCart = new Cart({...req.body,user_id:req.user._id});
      const result = await newCart.save();

      return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error', message:error.message });
  }
}

exports.updateCart = async (req, res) => {
    
    try {

     
      return res.status(200).json({'description':'called'});
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.deleteCartItem = async (req, res) => {
    
  try {

    const {cartId} = req.body;
    
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

    const result = await Cart.findOneAndUpdate(
      {user_id:req.user._id, _id:cartId},
      { $set: {status:'removed'} },
      { new: true });

    const cartData = await Cart.find({user_id:req.user._id, status:'open'}).populate({
        path: 'artist',
        populate: {
          path: 'profile',
          model: 'profile'
        }
      });

    return res.status(200).json(cartData);

  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

