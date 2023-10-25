const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        unique : true,
        ref : "users"       
    },
    Address : {
        type: Schema.Types.ObjectId, 
        ref : "address",
        unique : true,
        sparse: true
    },
    coords:{
        type:JSON,
        required:true
    },
    status: {
        type: String,
        default: "pending" // Set the default value to "pending"
    },

}, { timestamps : true})

const model = moongoose.model("artists", ArtistSchema)
module.exports = model;