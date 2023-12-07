const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistRequestSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        unique : true,
        ref : "users"       
    },
    services:[
        {
            required : true,
            type : Schema.Types.ObjectId,
            ref : "services" 
        }
    ],
    products:[
        {
            required : true,
            type : Schema.Types.ObjectId,
            ref : "products" 
        }
    ],
    coords:JSON,
    address:JSON,
    travel:Boolean,
    experience:String,
    education:String,
    languages:JSON,
    gallery:[{type:JSON}],
    description:String,
    pricing:[{type:JSON}],
    status:String

}, { timestamps : true})

const model = moongoose.model("artists_request", ArtistRequestSchema)
module.exports = model;