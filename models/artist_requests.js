const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ArtistRequestSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "users"       
    },
    services:[
        {
            type : Schema.Types.ObjectId,
            ref : "services" 
        }
    ],
    products:[
        {
            type : Schema.Types.ObjectId,
            ref : "products" 
        }
    ],
    fullname:String,
    email:String,
    mobile:String,
    instaId:String,
    dob:String,
    gender:String,
    mobileVerified:{type:Boolean,default:false},
    emailVerified:{type:Boolean,default:false},
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
    alias:String,
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