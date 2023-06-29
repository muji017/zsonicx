const User=require('../model/usersModel')
const isLogin =async(req,res,next)=>{
    try{
        const user=await User.findOne({_id:req.session.user_id})
        // console.log(user);
        if(req.session.user&&user.is_blocked==0){}
        else{
            res.redirect('/')
        }
        next()
        
    }
    catch(error){
        console.log(error.message);
    }
}
const isLogout =async(req,res,next)=>{
    try{
        const user=await User.findOne({_id:req.session.user_id})
        if(req.session.user&&user.is_blocked==0){
            res.redirect('/home')
        }else{
        next()
        }
    }
    catch(error){
        console.log(error.message);
    }
}


module.exports={
    isLogin,
    isLogout,

}