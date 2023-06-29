
const isLoginAdmin =async(req,res,next)=>{
    try{
        if(req.session.admin){}
        else{
            res.redirect('/admin')
        }
        next()
        
    }
    catch(error){
        console.log(error.message);
    }
}
const isLogoutAdmin =async(req,res,next)=>{
    try{
        if(req.session.admin){
            res.redirect('/admin/adminhome')
        }else{
        next()
        }
    }
    catch(error){
        console.log(error.message);
    }
}
module.exports={
    isLoginAdmin,
    isLogoutAdmin
}