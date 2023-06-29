const mongoose=require('mongoose')

const cart=mongoose.Schema({
    userid:{
        type:String,
        required:true
    },
   products:[{
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity:{
        type:Number,
        default:1
    }
}]
})

module.exports=mongoose.model('Cart',cart)