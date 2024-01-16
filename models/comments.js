const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
     comment : {
        required : true,
        type : String,
     }, 
     first_name : {
        type : String,
     } ,
     last_name : {
        type : String,
     },
     blog : {
        required : true,
        type : Schema.Types.ObjectId,
        ref:"blogs"
     } , 
     status:{
        type : String,
        required : true,
        default:'Pending',
    },
},{ timestamps : true})

const model = mongoose.model("comments", CommentSchema)
module.exports = model;
