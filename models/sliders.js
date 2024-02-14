const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const SlidersSchema = new Schema({   
    title : {
        type : String,
        required : true,
        unique:true, 
        sparse: true
    },
    image: JSON,
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


const model = moongoose.model("sliders", SlidersSchema)
module.exports = model;

