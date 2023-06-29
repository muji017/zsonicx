const mongoose=require('mongoose');

const coupon=mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    offer:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        required:true
    }


});

module.exports=mongoose.model('Coupon',coupon);