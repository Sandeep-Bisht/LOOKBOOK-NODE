const Blog = require('../../models/blog')
const {uploadFilesToImagekit} = require('../../config/upload')

module.exports = {
    create : async(req,res) => {
        try {
            var data = {...req.body}
            if (req.files) {
              let fileUploadResponse = await uploadFilesToImagekit(req);
              if(fileUploadResponse && fileUploadResponse.length > 0){
                let featuredImage = fileUploadResponse.find((item) => item.fieldName == 'featuredImage');
                if(featuredImage) data = {...data,featuredImage:featuredImage.response};
              }
            }
            Blog.create(data).then((result) => {
                if(result) {
                    res.status(200).json({
                        error: false,
                        messege : "Blog created successfully"
                    })
                } else{
                    res.status(400).json({
                        error : true,
                        messege : "Something went wrong"
                    })
                }
            }).catch((err) => {
              if (err.code === 11000) {
                res.status(400).json({
                    error: true,
                  message: "Blog already exists",
                });
              } else {
                res.status(400).json({
                    error:true,
                  message: "Please provide correct information",
                });
              }
            });
        } catch (error) {
            res.stautus(500).json({
                error: true,
                message : "Please provide correct information"
            })
        }
    },
    get_all_blog : async(req,res) => {
        try {
            Blog.find().then((result)=> {
                if(result){
                    res.status(200).json({
                        error : false,
                        message : "Data found",
                        data : result
                    })
                } else {
                    res.status(400).json({
                        error : true,
                        message : "Something went wrong"
                    })
                }
            }).catch((error)=>{
                res.status(400).json({
                    error:true,
                    message :"Somthing went wrong"
                })
            })
        } catch (error) {
            res.status(400).json({
                error : false,
                message : "Please provide correct information"
            })
        }
    },
    get_blog_by_id : async(req,res) => {
        const {_id} = req.body;
        try{
           await Blog.findById(_id).then((result)=>{
              if(result!==null)
              {
                res.status(200).json({
                    error:false,
                    message:"Data Found",
                    data:result
                })
              }else{
                res.status(400).json({
                    error:true,
                    message:"Data not found"
                })
              }
           })
        }catch(error){
            res.status(500).json({
                error:true,
                message:"Something went wrong, please try again later."
            })
        }
    },
    update_blog : async(req,res)=>{
    let data = {};
      const {_id,title,slug,description,content} = req.body;
      data={
        _id:_id,
        title:title,
        slug:slug,
        description:description,
        content:content,
      }
      if (req.files) {
        try {
          let fileUploadResponse = await uploadFilesToImagekit(req);
          if (fileUploadResponse && fileUploadResponse.length > 0) {
            let featuredImage = fileUploadResponse.find((item) => item.fieldName == 'updatedFeaturedImage');
            if (featuredImage) data = { ...data, featuredImage: featuredImage.response };
          }
        } catch (uploadError) {
          return res.status(500).json({
            error: true,
            message: "Error uploading files.",
          });
        }
      }
      try{
        await Blog.findByIdAndUpdate(_id,data).then((result)=>{
            if(result){
                res.status(200).json({
                    error:false,
                    message:"Blog updated Successfully"
                })
            }else{
                res.status(400).json({
                    error:true,
                    message:"Error updating Blog"
                })
            }
          })
      }catch(error){
         res.status(500).json({
            error:true,
            message:"Something went wrong, please try again later."
         })
      }
    }
}