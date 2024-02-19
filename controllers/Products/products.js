const Products = require("../../models/products");
const {uploadFilesToImagekit} = require('../../config/upload');
const slugify = require('slugify');

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

      data.slug = slugify(data.title, {
        lower: true,    // Convert to lowercase
        strict: true    // Remove special characters
      });
  
      Products.create(data).then((result)=>{
        if (result) {
          res.status(200).json({
            error: false,
            message: "Service created successfully",
            data: result
          });
        } else {
          res.status(400).json({
            error: true,
            message: "Please provide correct information"
          });
        }
      }).catch((error)=>{
        res.status(400).json({
          error : true,
          message: "Please provide correct information"
        });
      })

    } catch (error) {
      res.status(500).json({
         error : true,
         message: 'Internal server error'
         });
    }
  },  

  get_all_products:(req,res)=>{
    try{
      Products.find().then((result)=>{
        return res.status(200).json({
          error:false,
          message:"get all services",
          data:result
        })
      })
    }
    catch(error){
      ras.status(400).json({
        error:true,
        message:"Somthing went wrong"
      })
    }
  },

  get_product_by_id: async (req, res) => {
    const { _id } = req.body;
    try {  
      await Products.findById(_id).then((result)=>
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
  },

  update_product:async(req,res)=>{
    let data = {};
  
    const { title, _id } = req.body;
    data = {
      _id: _id,
      title: title,
    };

    data.slug = slugify(data.title, {
      lower: true,    // Convert to lowercase
      strict: true    // Remove special characters
    });
  
    if (req.files) {
      try {
        let fileUploadResponse = await uploadFilesToImagekit(req);
        if (fileUploadResponse && fileUploadResponse.length > 0) {
          let icon = fileUploadResponse.find((item) => item.fieldName == "updatedIcon");
          if (icon) data = { ...data, icon: icon.response };
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
      const result = await Products.findByIdAndUpdate(_id, data);
      if (result) {
        return res.status(200).json({
          error: false,
          message: "Products updated successfully",
        });
      } else {
        return res.status(400).json({
          error: true,
          message: "Error updating Products",
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Something went wrong, please try again later.",
      });
    }
}

}