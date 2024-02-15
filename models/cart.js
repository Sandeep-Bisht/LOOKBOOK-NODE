const moongoose = require('mongoose')
const Schema = moongoose.Schema

const CartSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "users"       
    },
    artist: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "artists"       
    },
    service: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "services"       
    },
    date: {
        required : true,
        type : String,     
    },
    sessions: {
        required : true,
        type : Number,     
    },
    time: {
        required : true,
        type : String,     
    },
    status: {
        type: String,
        default: "open" // Set the default value to "active"
    }

}, { timestamps : true})

const model = moongoose.model("cart", CartSchema)
module.exports = model;