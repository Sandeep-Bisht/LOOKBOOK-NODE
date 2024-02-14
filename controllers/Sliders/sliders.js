const Sliders = require("../../models/sliders");
const {uploadFilesToImagekit} = require('../../config/upload');

exports.create = async (req, res) => {
    try {
      let data = { ...req.body,createdBy:req.user._id };
      if (req.files) {
        let fileUploadResponse = await uploadFilesToImagekit(req);
        if(fileUploadResponse && fileUploadResponse.length > 0){
          let image = fileUploadResponse.find((item) => item.fieldName == 'image');
          if(image) data = {...data,image:image.response};
        }
      }
  
      Sliders.create(data).then((result)=>{
        if (result) {
          res.status(200).json({
            status: 200,
            message: "Slider created successfully",
            data: result
          });
        } else {
          res.status(400).json({
            status: 400,
            message: "Please provide correct information"
          });
        }
      }).catch((error)=>{
        res.status(400).json({
          status: 400,
          message: "Please provide correct information"
        });
      })

    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },  

exports.get_all_sliders = async(req,res)=>{
    try{
      await Sliders.find().then((result)=>{
        if(result && result.length>0)
        {
          res.status(200).json({
            error: false,
            message:"get all sliders",
            data:result
          })
        }
        else{
          res.status(400).json({
            error:true,
            message:"please provide correct information",
          })
        }
      })
    }
    catch(error){
      res.status(500).json({
        error:true,
        message:"please provide correct information"
      })
    }

  },
   
exports.update_slider = async (req, res) => {
    let data = {};
  
    const { title, _id, status } = req.body;
    data = {
      _id: _id,
      title: title,
      status : status,
    };
  
    if (req.files) {
      try {
        let fileUploadResponse = await uploadFilesToImagekit(req);
        if (fileUploadResponse && fileUploadResponse.length > 0) {
          let image = fileUploadResponse.find((item) => item.fieldName == 'updatedImage');
          if (image) data = { ...data, image: image.response };
        }
      } catch (uploadError) {
        return res.status(500).json({
          error: true,
          message: "Error uploading files.",
        });
      }
    }
  
    try {
      const result = await Sliders.findByIdAndUpdate(_id, data);
      if (result) {
        return res.status(200).json({
          error: false,
          message: "sliders updated successfully",
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "Error updating sliders",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Something went wrong, please try again later.",
      });
    }
  }

exports.get_slider_by_id = async (req, res) => {
    const { _id } = req.body;
    try {  
      await Sliders.findById(_id).then((result)=>
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
      res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  }