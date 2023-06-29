const express=require('express');
const userroute=express();
const usercontroller=require('../controllers/usersController');
const session=require('express-session');
const config=require('../config/config');
const nocache=require('nocache');

userroute.use(nocache());
userroute.use(session({secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false
}));

const auth=require('../middleware/auth');

const bodyparser=require('body-parser');
userroute.use(bodyparser.json());
userroute.use(bodyparser.urlencoded({extended:true}));

userroute.set('view engine','ejs');
userroute.set('views','./views');

const multer= require('multer');
const path=require('path');

const storage=multer.diskStorage({
    destination:function(req,file,callb){
        callb(null,path.join(__dirname,'../public/images/user'));
    },
    imagename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});
const upload =multer({storage:storage});



userroute.get('/signup',auth.isLogout,usercontroller.signup);

userroute.get('/login',auth.isLogout,usercontroller.login);

userroute.get('/',auth.isLogout,usercontroller.login);

userroute.post('/login',usercontroller.loginpost);

userroute.get('/home',auth.isLogin,usercontroller.home);

userroute.post('/signup',auth.isLogout,upload.single('image'), usercontroller.insertuser);

userroute.get('/verify',auth.isLogout,usercontroller.verifyMail);

userroute.get('/logout',usercontroller.userlogout);

// userroute.get('/forget',auth.isLogout,usercontroller.forget);

userroute.post('/forget',usercontroller.forgetrequest);

// userroute.get('/checkotpget',auth.isLogout,usercontroller.checkotpget);
userroute.post('/checkotp',usercontroller.checkotp);

userroute.get('/resetpassword',auth.isLogout,usercontroller.resetpassword);
userroute.post('/resetpassword',usercontroller.resetpasswordpost);

// userroute.post('/otpcheck',usercontroller.checkotpget);

userroute.get('/otplogin',auth.isLogout,usercontroller.otplogin);
userroute.post('/otplogin',usercontroller.otploginpost);


userroute.get('/otpconform',auth.isLogout,usercontroller.otpconform);
userroute.post('/otpconform',usercontroller.otpconformpost);

userroute.get('/viewproduct',auth.isLogin,usercontroller.viewproduct);

userroute.get('/viewproductdetails',auth.isLogin,usercontroller.viewproductdetails);

userroute.get('/cart',auth.isLogin,usercontroller.viewcart);
userroute.get('/addtocart',auth.isLogin,usercontroller.addtocart);
userroute.get('/deletecart',auth.isLogin,usercontroller.deletecart);

userroute.get('/profile',auth.isLogin,usercontroller.profile);
userroute.post('/addaddress',auth.isLogin,usercontroller.address);
userroute.post('/savechanges',auth.isLogin,usercontroller.savechanges);
userroute.get('/deleteaddress',auth.isLogin,usercontroller.deleteaddress);
userroute.post('/changepassword',auth.isLogin,usercontroller.changepassword);

userroute.post('/checkout',auth.isLogin,usercontroller.checkout);
userroute.post('/processpayment',upload.none(),auth.isLogin,usercontroller.processpayment);

userroute.get('/orders',auth.isLogin,usercontroller.orders);
userroute.post('/cancelorder',auth.isLogin,usercontroller.cancelorder);

userroute.get('/cartupdate',auth.isLogin,usercontroller.cartupdate);

userroute.get('/page',auth.isLogin,usercontroller.page);

userroute.post('/clearotp',auth.isLogin,usercontroller.clearotp);

userroute.post('/searchproduct',auth.isLogin,usercontroller.searchproduct);

userroute.post('/createOrder',auth.isLogin,usercontroller.createOrder);

userroute.post('/orderreturn',auth.isLogin,usercontroller.orderreturn);

userroute.get('/invoice',auth.isLogin,usercontroller.invoice);

userroute.get('/error',usercontroller.errorpage);

userroute.post('/uploadprofpic',auth.isLogin,upload.single('image'),usercontroller.uploadprofpic)

userroute.get('*',usercontroller.unmatch);

module.exports=userroute;