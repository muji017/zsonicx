const mongoose=require('mongoose')

const category=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    offer:{
        type:Number,
        default:0
    }

})

module.exports=mongoose.model('Category',category)