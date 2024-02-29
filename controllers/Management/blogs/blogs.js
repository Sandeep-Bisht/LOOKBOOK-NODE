const Blog = require('../../../models/blog')
const Comment  = require('../../../models/comments')

exports.get_all_blog = async(req,res) => {
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
}