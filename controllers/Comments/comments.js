const Comments = require("../../models/comments")
module.exports = {
    create : async(req,res)=>{
       const data = {...req.body};
       try{
        Comments.create(data).then((result)=>{
            if(result)
            {
                res.status(200).json({
                    error:false,
                    message:"comments created"
                })
            }
            else{
                res.status(400).json({
                    error:true,
                    message:"provide correct information"
                })
            }
           })
       }catch(error){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
       }
    },
    getAllComments : async(req,res)=>{
        try{
            Comments.find().populate("blog").then((result)=>{
                if(result){
                    res.status(200).json({
                        error:false,
                        data:result,
                        message:"data found"
                    })
                }
                else{
                    res.status(400).json({
                        error:false,
                        message:"data not found"
                    })
                }
            })
        }catch(error){
            res.status(500).json({
                error:true,
                message:"Something went wrong please try again later."
            })
        }
    },
    deleteCommentById : async(req,res)=>{
        const {comment_id} = req.param
        try{
            Comments.findByIdAndDelete(comment_id);
            res.status(200).json({
                 message: 'Comment deleted successfully' 
                });
        }catch(error){
            res.status(500).json({
                error:true,
                message:"Something went wrong please try again later."
            })
        }
    }
}