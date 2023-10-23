const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const AddressSchema = new Schema({   
    user_id : {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "Profile"
    },
    address : {
        type : Array,
        required : true
    }

}, {timestamps : true})


const model = moongoose.model("UserAddress", AddressSchema)
module.exports = model;

