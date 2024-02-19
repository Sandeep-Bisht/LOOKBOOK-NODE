const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        unique : true,
        ref : "users"       
    },
    userName:{
        type:String,
        required:true,
        unique:true
    },
    instagram:{
        type:String,
        required:true
    },
    profile: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "profile"       
    },
    services:[
        {   
            type : JSON, 
        }
    ],
    categories:[
        {
            required:true,
            type : Schema.Types.ObjectId,
            ref : "artist_category" 
        }
    ],
    featuredCategory:{
        required:true,
        type : Schema.Types.ObjectId,
        ref : "artist_category" 
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
    travel:{
        type:Boolean
    },
    experience:{
        type:Number
    },
    education:{
        type:String
    },
    languages:[{type:JSON}],
    gallery:[{
        type:JSON,
        required:true
    }],
    description:String,
    pricing:{
        type:JSON,
        required:true
    },
    kyc:{
        required:true,
        type : Schema.Types.ObjectId,
        ref : "kyc" 
    },
    certificates:[{type:JSON}],
    address : { type : JSON },
    featured_artist: {
        type: Boolean,
        default: false, // or true, depending on your default value
    },
    emerging_artist: {
        type: Boolean,
        default: false, // or true, depending on your default value
    },
    order:Number ,
    status: {
        type: String,
        default: "active" // Set the default value to "active"
    },

}, { timestamps : true})

const model = moongoose.model("artists", ArtistSchema)
module.exports = model;