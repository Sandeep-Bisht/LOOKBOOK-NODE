const moongoose = require('mongoose');

const Schema = moongoose.Schema;

const ProductsSchema = new Schema({   
    title : {
        type : String,
        required : true,
        unique:true, 
        sparse: true
    },
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
        default:'Active',
    },
    createdBy: {
        required : true,
        type: Schema.Types.ObjectId, 
        ref : "users"
    }

}, {timestamps : true})


const model = moongoose.model("products", ProductsSchema)
module.exports = model;

