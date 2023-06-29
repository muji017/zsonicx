const mongoose=require('mongoose');

const user=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    is_verified:{
        type:Number,
        required:true
    },
    address: [
        {
            head:{
                type:String
            },
            street: {
                type: String,
            },
            city: {
                type: String
            },
            pincode:{
                type:Number,
            },
            state:{
                type:String,
            },
            country: {
                type: String,
            }
        }
    ],
    otp:{
        type:String,
        default:''
    },
    is_admin:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Number,
        default:0
    },
    wallet:{
        type:Number,
        default:0
    },
    reference:{
       type:String
    }

});

module.exports=mongoose.model('User',user);