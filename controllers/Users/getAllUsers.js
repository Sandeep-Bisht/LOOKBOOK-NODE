require('dotenv').config();

exports.getAllUsers = async (req, res) => {
    try{
        return res.send("get all user called.")
    }
    catch(err){
        res.status(500).json({
            error:true,
            message:"Something went wrong please try again later."
        })
    }
}
