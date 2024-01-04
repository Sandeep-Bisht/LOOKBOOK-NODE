const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
     title : {
        required : true,
        type : String,
     },
     slug : {
        required : true,
        type : String,
        unique : true,
     },
     description : {
        type : String
     },    
     status:{
        type : String,
        required : true,
        default:'Published',
    },
})

const model = mongoose.model("categories", CategorySchema)
module.exports = model;
