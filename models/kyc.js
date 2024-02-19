const { model, Schema } = require('mongoose');

const kycSchema = new Schema({
    adharFront:{
        type:JSON,
        required:true
    },
    adharBack:{
        type:JSON,
        required:true
    },
    panCard:{
        type:JSON,
        required:true
    },
    status: { 
        type: String, 
        default:'verified'
    },
},{timestamps: true})

module.exports = model('kyc',kycSchema);