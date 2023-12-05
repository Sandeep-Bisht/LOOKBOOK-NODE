require('dotenv').config();
const ProductsSchema = require("../../models/products");
const {uploadFilesToImagekit} = require('../../config/upload')
// console.log("inside product route")

module.exports={
  
  create: async (req, res) => {
    console.log(req, "check the req body")
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
  
      ProductsSchema.create(data).then((result)=>{
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

  find_all:(req,res)=>{
    try{
      ProductsSchema.find().then((result)=>{
        if(result && result.length>0)
        {
          res.json({
            status:200,
            message:"get all services",
            data:result
          })
        }
        else{
          res.json({
            status:400,
            message:"please provide correct information",
          })
        }
      })
    }
    catch(error){
      console.log(error)
    }

  }
    // find_and_update:(req,res)=>{
    //     const {_id,service} = req.body;
    //     const data={
    //         id:id,
    //         service:service
    //     }
    //     if(req.files.icon)
    //     {
    //         data.icon=req.files.icon
    //     }
    //     if(req.files.image)
    //     {
    //         data.icon=req.files.image
    //     }
    //     try{  
    //       ProductsSchema.find_and_delete(_id,data).then((result) => {      
    //           if (result.length>0) {  
    //             res.status(200).json({
    //               data: result,
    //               msg:'cart item deleted'
    //             });
                     
    //           } else {
    //             res.json({
    //               error: 400,
    //               message: "Data Not Found",
    //             });
    //           }
    //         })
    //       }
    //        catch (err) {
    //           console.log(err);
    //           res.json({
    //             sucess: 400,
    //             message: "Please provide correct information",
    //           });
    //         }     
    //   }
}