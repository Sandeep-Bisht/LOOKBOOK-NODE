const moongoose = require('mongoose')
const Schema = moongoose.Schema

const PaymentsSchema = new Schema({
    user_id: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "users"       
    },
    cart: [{
        required : true,
        type : Schema.Types.ObjectId,     
        ref : "cart"    
    }],
    amount: {
        type:String,
        required:true
    },
    currency: {
        type:String,
        required:true
    },
    receipt:{
        type:String,
        required:true,
        unique:true
    },
    orderId:{
        type:String,
        required:true,
        unique:true
    },
    paymentId:{
        type:String,
        unique:true,
        sparse:true,
    },
    error:{
        type:JSON
    },
    rzp_order_createdAt:{
        type:String,
    },
    payment_status:{
        type : String,
        required : true,
    },
    created_by: {
        required : true,
        type : Schema.Types.ObjectId,
        ref : "users"       
    },
    modified_by:  {
        type : Schema.Types.ObjectId,
        ref : "users"       
    }

}, { timestamps : true})

const model = moongoose.model("payments", PaymentsSchema)
module.exports = model;