const BlogSchema = require('../../models/blog')
require('dotenv').config();
const {uploadFilesToImagekit} = require('../../config/upload')
console.log("inside the blogs page")

module.exports = {
    create : async(req,res) => {
      console.log(req,"check the data inside blog")
        try {
            var data = {...req.body}
            if (req.files) {
              let fileUploadResponse = await uploadFilesToImagekit(req);
              if(fileUploadResponse && fileUploadResponse.length > 0){
                let icon = fileUploadResponse.find((item) => item.fieldName == "icon")
                if(icon) data = {...data,icon:icon.response};
                let image = fileUploadResponse.find((item) => item.fieldName == 'image');
                if(image) data = {...data,image:image.response};
              }
            }
            BlogSchema.create(data).then((result) => {
                if(result) {
                    res.json({
                        sucesss : 200,
                        messege : "Blog created successfully"
                    })
                } else{
                    res.json({
                        success : 200,
                        messege : "Something went wrong"
                    })
                }
            }).catch((err) => {
              if (err.code === 11000) {
                res.status(400).json({
                  success: 400,
                  message: "Blog already exists",
                });
              } else {
                console.log(err);
                res.json({
                  success: 400,
                  message: "Please provide correct information",
                });
              }
            });
        } catch (error) {
            console.log(error)
            res.json({
                success : 400,
                message : "Please provide correct information"
            })
        }
    },
    find_all : async(req,res) => {
        try {
            BlogSchema.find_all().then((result)=> {
                if(result){
                    res.json({
                        success : 200,
                        message : "Data found",
                        data : result
                    })
                } else {
                    res.json({
                        success : 200,
                        message : "Something went wrong"
                    })
                }
            }).catch((error)=>{
              console.log(error);
            })
        } catch (error) {
            console.log(error)
            res.json({
                success : 400,
                message : "Please provide correct information"
            })
        }
    },
    find_by_slug : async(req,res) => {
        const { slug } = req.body;
        try {
            BlogSchema.find_by_slug(slug).then((result) => {
                if(result) {
                    res.json({
                        success : 200,
                        data : result,
                        message : "Data found"
                    })
                } else{
                    res.json({
                        success :200,
                        message : "Something went wrong"
                    })
                }
            })
        } catch (error) {
            console.log(error)
            res.json({
                success : 400,
                message : "Please provide correct information"
            })
        }
    },
    find_and_update:(req,res,next)=>{
  
        const{_id,title,description,content}=req.body;
        const data={
          _id:_id,
          title:title,
          description:description,
          content:content,
        }   
        if(req.files[0]){
          data.featuredImage = req.files;     
        } 
        try{  
            BlogSchema.find_and_update(_id,data).then((result) => {      
            if (result) {  
              res.json({
                success : 200,
                data: result,
                msg:'Data found'
              });
                   
            } else {
              res.json({
                error: 404,
                message: "Data Not Found",
              });
            }
          })
        }
         catch (err) {
            console.log(err);
            res.json({
                error: 400,
              message: "Please provide correct information",
            });
          }
        },
      find_and_delete:(req,res)=>{
        const {_id} = req.body
        
        try{  
            BlogSchema.find_and_delete(_id).then((result) => {      
              if (result) {  
                res.json({
                    success:200,
                  data: result,
                  msg:'Blog deleted'
                });
                     
              } else {
                res.json({
                  error: 200,
                  message: "Data Not Found",
                });
              }
            })
          }
           catch (err) {
              console.log(err);
              res.json({
                error: 400,
                message: "Please provide correct information",
              });
            }     
      }
}