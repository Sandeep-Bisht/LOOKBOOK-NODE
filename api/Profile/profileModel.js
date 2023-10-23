const moongoose = require('mongoose')
const Schema = moongoose.Schema

const ProfileSchema = new Schema({
    user_id : {
        required : true,
        type : String,
        unique : true       
    },

    userName : {
        required : true,
        type : String,
    },
    userEmail:{
        required : true,
        type : String,
        unique : true
    },
    userPhoneNumber : {
        required : true,
        type : String
    },
    userAddress : {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "Address"
    }

}, { timestamps : true})

const model = moongoose.model("Profile", ProfileSchema)
module.exports = model;