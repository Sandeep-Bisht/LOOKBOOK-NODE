const Blog = require('../../models/blog')
require('dotenv').config();
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
            Blog.find_all().then((result)=> {
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
    }
}