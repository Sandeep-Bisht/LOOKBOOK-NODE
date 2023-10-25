const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistServicesSchema = new Schema({
    artist_id: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "artists"       
    },
    service_id: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "services"       
    },
    price_per_hour:{
        required : true,
        type: String,
    },
    price_per_day:{
        required : true,
        type: String,
    },
    featured_img:JSON,
    images:[{
        type:JSON
    }]

}, { timestamps : true})

const model = moongoose.model("artist_services", ArtistServicesSchema)
module.exports = model;