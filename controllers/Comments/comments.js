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
    updateCommentById : async(req,res)=>{
      const {_id,status} = req.body;
      try{
        Comments.findByIdAndUpdate(_id,{$set:{ status }},{new : true}).then((result)=>{
            if(result){
                res.status(200).json({
                  data:result,
                  message:"comment updated successfully"
                })
            }
            else{
                res.status(400).json({
                    message:"provide correct information"
                  })
            }
          })
      }catch(error){
        console.log(error)
      }
    },
    deleteCommentById: async (req, res) => {
        const { comment_id } = req.params;
        try {
            const deletedComment = await Comments.findByIdAndDelete(comment_id);
    
            if (deletedComment) {
                res.status(200).json({
                    message: 'Comment deleted successfully',
                });
            } else {
                res.status(404).json({
                    error: true,
                    message: 'Comment not found',
                });
            }
        } catch (error) {
            res.status(500).json({
                error: true,
                message: 'Something went wrong, please try again later.',
            });
        }
    },   
}