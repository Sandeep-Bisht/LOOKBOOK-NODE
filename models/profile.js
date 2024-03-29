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
    address : [{ type : JSON }],
    status:{
        type : String,
        required : true,
        default:'active',
    },

}, { timestamps : true})

const model = moongoose.model("profile", ProfileSchema)
module.exports = model;