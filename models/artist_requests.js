const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistRequestSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "users"       
    },
    userName:{ 
        type:String, 
        unique:true, 
        sparse: true 
    },
    instagram:{
        type:String,
    },
    profile: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "profile"       
    },
    categories:[
        {
            type : Schema.Types.ObjectId,
            ref : "artist_category" 
        }
    ],
    products:[
        {
            type : Schema.Types.ObjectId,
            ref : "products" 
        }
    ],
    featuredCategory:{
        type : Schema.Types.ObjectId,
        ref : "artist_category" 
    },
    coords:JSON,
    travel:Boolean,
    experience:String,
    education:String,
    languages:JSON,
    currentStep:{
        type: Number,
        default: 1
    },
    gallery:[{type:JSON}],
    description:String,
    pricing:JSON,
    adharFront:JSON,
    adharBack:JSON,
    panCard:JSON,
    certificates:[{type:JSON}],
    remark:{type:String},
    status:{
        type:String,
        default: "progress"
    }

}, { timestamps : true})

const model = moongoose.model("artists_request", ArtistRequestSchema)
module.exports = model;