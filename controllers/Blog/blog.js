const Blog = require('../../models/blog')
const {uploadFilesToImagekit} = require('../../config/upload')
const Category = require('../../models/category')
const Comment = require('../../models/comments')

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
          const blogs = await Blog.find().populate("category"); 

          if(!blogs){
            return res.status(400).json({
              error : true,
              message : "Bad request."
            })
          }

          const promises = blogs.map(async (data) => {
            // Perform some asynchronous operation
            let dataCopy = {...data._doc}
            dataCopy['comments'] = await Comment.find({ blog: data._id, status:'approved' });
            return dataCopy;
        });

        const results = await Promise.all(promises);
      
          return res.status(200).json({
            error : false,
            message : "Data found",
            data : results
        });

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
           await Blog.findById(_id).populate("category").then((result)=>{
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
      const {_id,title,slug,description,content,tags,category,forArtist} = req.body;
      data={
        _id:_id,
        title:title,
        slug:slug,
        description:description,
        content:content,
        tags:tags,
        category:category,
        forArtist:forArtist,
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
    },
    get_blog_by_slug: async (req, res) => {
      try {
          const {category_slug, slug} = req.params;

          const category = await Category.findOne({ slug: category_slug });
    
          if (!category) {
            return res.status(400).json({
              error: true,
              message: "Category not found for this slug."
            });
          }
          
          let similarBlogs = await Blog.find({ category: category._id }).populate("category");

          if (!similarBlogs) {
            return res.status(400).json({
              error: true,
              message: "Bad request."
            });
          }

          let currentBlog = similarBlogs.find((item) => item.slug === slug);

          if(!currentBlog){
            return res.status(400).json({
              error: true,
              message: "Bad request."
            });
          }


        const promises = similarBlogs.map(async (data) => {
          // Perform some asynchronous operation
          let dataCopy = {...data._doc}
          dataCopy['comments'] = await Comment.find({ blog: data._id, status:'approved' });
          return dataCopy;
        });

        const results = await Promise.all(promises);

        currentBlog = results.find((item) => item.slug === slug);
        similarBlogs = results.filter((item) => item.slug !== slug);
        
        return res.status(200).json({
          error : false,
          similarBlogs,
          currentBlog,
          message : "Data found successfully."
        })

      } catch (error) {
          res.status(500).json({
              error: true,
              message: "Something went wrong, please try again later.",
          });
      }
    },
    get_Blog_CategoryById: async (req, res) => {
      const { category_id } = req.params;
      try {
        const blogs = await Blog.find({ category: category_id }).populate("category");
        if (!blogs || blogs.length === 0) {
          return res.status(404).json({
            error: true,
            message: "No Blogs found for this Category ID."
          });
        }
        return res.status(200).json(blogs);
      } catch (error) {
        res.status(500).json({
          error: true,
          message: "Error finding Blogs for this Category ID."
        });
      }
    },
     get_Blog_By_CategorySlug : async (req, res) => {
      const { category_slug } = req.params;
      try {
        const category = await Category.findOne({ slug: category_slug });
    
        if (!category) {
          return res.status(404).json({
            error: true,
            message: "Category not found for this slug."
          });
        }
    
        const blogs = await Blog.find({ category: category._id }).populate("category");

        if(!blogs){
          return res.status(400).json({
            error : true,
            message : "Bad request."
          })
        }

        const promises = blogs.map(async (data) => {
          // Perform some asynchronous operation
          let dataCopy = {...data._doc}
          dataCopy['comments'] = await Comment.find({ blog: data._id, status:'approved'});
          return dataCopy;
      });

      const results = await Promise.all(promises);
    
        return res.status(200).json({
          error : false,
          message : "Data found",
          data : results
      });

    
      } catch (error) {
        res.status(500).json({
          error: true,
          message: "Internal Server Error."
        });
      }

    },
    addView : async (req,res) =>{
      try{
        const {category_slug, slug} = req.params;
        return res.status(200).send("called");

      }
      catch(error){
        return res.status(200).send("called error.");
      }
    }
  
}