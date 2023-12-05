const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const ProductsSchema = new Schema({   
    product : {
        type : String,
        required : true,
        unique:true, 
        sparse: true
    },
    icon: JSON,
    image: JSON,
    createdBy: {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "users"
    }

}, {timestamps : true})


const model = moongoose.model("products", ProductsSchema)
module.exports = model;

