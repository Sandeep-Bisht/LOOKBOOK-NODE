const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistRequestSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        unique : true,
        ref : "users"       
    },
    
    

}, { timestamps : true})

const model = moongoose.model("artists_request", ArtistRequestSchema)
module.exports = model;