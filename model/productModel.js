const mongoose=require('mongoose')

const product=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    brand:{
        type:String,
        required:true
    },
    category:[{
        type:mongoose.Types.ObjectId,
        ref:'Category',
        required:true
    }],
    image:{
        type:Array,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    is_delete:{
        type:Number,
        default:0
    },
    offer:{
        type:Number,
        default:0
    }
})

module.exports=mongoose.model('Product',product)