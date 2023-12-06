const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
    title: {
        required: true,
        type : String
    },
    slug: {
        required : true,
        type : String,
        unique : true
    },
    description: {
        type: String
    },
    featuredImage: {
        required : true,
        type:JSON
    },
    content: {
        required: true,
        type : String
    }
},{ timestamps : true})

const model = mongoose.model("blogs", BlogSchema)
module.exports = model;