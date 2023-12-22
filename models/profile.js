const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ProfileSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        unique : true,
        ref : "users"       
    },
    fullName: String,
    email: {
        type : String,
        unique : true,
        sparse: true
    },
    mobile: {
        unique : true,
        type : String,
        sparse: true
    },
    gender: {
        type: String,
    },
    dob: {
        type: String,
    },
    image:{
        type : JSON,
    },
    usertype:{
        type : String,
        required:true,
    },
    address : [{ type : JSON }],
    mobileVerified:{type:Boolean,default:false},
    emailVerified:{type:Boolean,default:false},
    status:{
        type : String,
        required : true,
        default:'Active',
    },

}, { timestamps : true})

const model = moongoose.model("profile", ProfileSchema)
module.exports = model;