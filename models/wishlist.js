const moongoose = require('mongoose');
const Schema = moongoose.Schema

const WishlistSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        unique : true,
        ref : "users"       
    },
    artist:[
        {   
            required:true,
            type : Schema.Types.ObjectId,
            ref : "artists" 
        }
    ],  
 
   

}, { timestamps : true})

const model = moongoose.model("wishlist", WishlistSchema)
module.exports = model;