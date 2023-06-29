const mongoose=require('mongoose');

const admin=mongoose.Schema({

    email:{
        type:String,
        required:true
    },
    key:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        default:''
    } ,
    is_admin:{
        type:Boolean,
        default:true
    }     
});

module.exports=mongoose.model('Admin',admin);