const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const slidesSchema = new Schema({   
    title : {
        type : String,
        required : true,
    },
    image: {
        type: JSON,
        required : true,
    },
    status:{
        type : String,
        required : true,
        default:'active',
    },
    order:Number,
    createdBy: {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "users"
    }

}, {timestamps : true})


const model = moongoose.model("slides", slidesSchema)
module.exports = model;

