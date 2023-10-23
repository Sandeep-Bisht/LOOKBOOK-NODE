const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const AddressSchema = new Schema({   
    user_id : {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "users"
    },
    address : {
        type : String,
        required : true
    }

}, {timestamps : true})


const model = moongoose.model("address", AddressSchema)
module.exports = model;

