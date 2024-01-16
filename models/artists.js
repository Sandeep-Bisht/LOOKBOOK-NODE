const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        unique : true,
        ref : "users"       
    },
    profile_id: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "profile"       
    },
    services:[
        {   
            required:true,
            type : Schema.Types.ObjectId,
            ref : "services" 
        }
    ],
    featuredService:{
        type : Schema.Types.ObjectId,
        ref : "services" ,
        required:true
    },
    products:[
        {
            required:true,
            type : Schema.Types.ObjectId,
            ref : "products" 
        }
    ],
    coords:{
        type:JSON,
        required:true
    },
    travel:Boolean,
    experience:String,
    education:String,
    languages:JSON,
    gallery:[{
        type:JSON,
        required:true
    }],
    description:String,
    pricing:{
        type:JSON,
        required:true
    },
    adharFront:{
        type:JSON,
        required:true
    },
    adharBack:{
        type:JSON,
        required:true
    },
    panCard:{
        type:JSON,
        required:true
    },
    certificates:[{type:JSON}],
    address : { type : JSON },
    status: {
        type: String,
        default: "active" // Set the default value to "active"
    },
    featuredTag: {
        type: Boolean,
        default: false, // or true, depending on your default value
    },
    emergingTag: {
        type: Boolean,
        default: false, // or true, depending on your default value
    }

}, { timestamps : true})

const model = moongoose.model("artists", ArtistSchema)
module.exports = model;