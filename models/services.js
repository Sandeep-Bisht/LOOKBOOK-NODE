const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const ServicesSchema = new Schema({   
    service : {
        type : String,
        required : true,
        unique:true, 
        sparse: true
    },
    icon: String,
    image: String,
    createdBy: {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "users"
    }

}, {timestamps : true})


const model = moongoose.model("services", ServicesSchema)
module.exports = model;

