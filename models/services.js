const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const ServiceSchema = new Schema({   
    title : {
        type : String,
        required : true,
        unique:true, 
        sparse: true
    },
    artist_category: [{
        required : true,
        type : Schema.Types.ObjectId,
        ref:"artist_category"
    }],
    icon: JSON,
    image: JSON,
    slug:{
        type : String,
        required : true,
        unique:true, 
    },
    status:{
        type : String,
        required : true,
        default:'active',
    },
    createdBy: {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "users"
    }

}, {timestamps : true})


const model = moongoose.model("services", ServiceSchema)
module.exports = model;

