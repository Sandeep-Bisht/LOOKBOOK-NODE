require('dotenv').config();
const Services = require("../../models/services");
const {uploadFilesToImagekit} = require('../../config/upload');
const { rawListeners } = require('../../models/blog');

module.exports={
  
  create: async (req, res) => {
    try {
      let data = { ...req.body,createdBy:req.user._id };
      if (req.files) {
        let fileUploadResponse = await uploadFilesToImagekit(req);
        if(fileUploadResponse && fileUploadResponse.length > 0){
          let icon = fileUploadResponse.find((item) => item.fieldName == "icon")
          if(icon) data = {...data,icon:icon.response};
          let image = fileUploadResponse.find((item) => item.fieldName == 'image');
          if(image) data = {...data,image:image.response};
        }
      }
  
      Services.create(data).then((result)=>{
        if (result) {
          res.status(200).json({
            status: 200,
            message: "Service created successfully",
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
      console.error(error, 'inside the try');
      res.status(500).json({ message: 'Internal server error' });
    }
  },  

  get_all_services:(req,res)=>{
    try{
      Services.find().then((result)=>{
        if(result && result.length>0)
        {
          res.status(200).json({
            error: false,
            message:"get all services",
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

  }
}