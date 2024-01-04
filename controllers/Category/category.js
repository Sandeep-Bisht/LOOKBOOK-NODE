const Category = require("../../models/category")

module.exports = {
    create: async (req, res) => {
        const { title, slug, description } = req.body;
        const data = {
            title: title,
            slug: slug,
            description: description
        };
        try {
            const result = await Category.create(data);
            if (result) {
                res.status(201).json({
                    error: false,
                    message: "Category created successfully"
                });
            } else {
                res.status(400).json({
                    error: true,
                    message: "Something went wrong"
                });
            }
        } catch (error) {
            res.status(500).json({
                error: true,
                message: "Please provide correct information"
            });
        }
    },

    getAllCategory : async (req, res )=>{
       try{
        await Category.find().then((result)=>{
            if(result.length>0)
            {
                res.status(200).json({
                    error:false,
                    message:"data found",
                    data:result,
                })
            }
            else{
                res.status(400).json({
                    error:true,
                    message:"data not found",
                })
            }
        });
       }catch(error){
        res.status(500).json({
            error: true,
            message: "Please provide correct information"
        });
       }
    },

    updateCategory : async (req,res)=>{
        let data = {}
        const {_id,title,slug,description} = req.body;
        data={
            _id:_id,
            title:title,
            slug:slug,
            description:description
        }
        try{
            await Category.findByIdAndUpdate(_id,data).then((result)=>{
                if(result){
                    res.status(200).json({
                        error:false,
                        message:"Category updated Successfully"
                    })
                }else{
                    res.status(400).json({
                        error:true,
                        message:"Error updating Category"
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
}
