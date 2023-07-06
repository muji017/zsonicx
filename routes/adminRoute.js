const express=require('express');
const adminroute=express();
const admincontroller=require('../controllers/adminController');
const session=require('express-session');
const config=require('../config/config');
const nocache=require('nocache');

adminroute.use(nocache());
adminroute.use(session({secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false
}));

const bodyparser=require('body-parser');
adminroute.use(bodyparser.json());
adminroute.use(bodyparser.urlencoded({extended:true}));

const auth=require('../middleware/adminuth');

adminroute.set('view engine','ejs');
adminroute.set('views','./views/admin');

const multer= require('multer');
const path=require('path');

// Define storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images/product'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

// Define file filter
const fileFilter = (req,file, cb) => {
    // Allowed file extensions
    const allowedExtensions = ['.jpg', '.jpeg'];

    // Check if the file extension is allowed
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(fileExtension)) {
        req.isFileValid = true;
        // Pass the file
        cb(null, true); 
    } else {
        req.isFileValid = false;
        // Reject the file
        req.session.errorFileUpload='Invalid file extension'; 
        // res.redirect(`/admin`)
        cb(null, false);
    
    }
};
  
const upload =multer({
    storage:storage,
    fileFilter:fileFilter,
    limits: {
        files: 5 // Maximum 5 files allowed
    }
});
function handleUploadError(err, req, res, next) {
    if (err instanceof multer.MulterError) {
    // Multer error occurred, handle it accordingly
        if (err.code === 'LIMIT_FILE_COUNT') {
            // Handle the case when the number of files exceeds the limit
            req.session.errorFileUpload='Number of files exceed Only 5 images allowed ';
            console.log(req.body.id);
            const productid=req.body.id;
            res.redirect(`/admin/editproduct/?id=${productid}`);
        } else {
            // Handle other Multer errors
            res.status(400).json({ error: 'File upload error' });
        }
    } else {
    // Other errors occurred, pass it to the next error handling middleware
        next(err);
    }
}
function handleUploadErrorAdd(err, req, res, next) {
    if (err instanceof multer.MulterError) {
    // Multer error occurred, handle it accordingly
        if (err.code === 'LIMIT_FILE_COUNT') {
            // Handle the case when the number of files exceeds the limit
            req.session.errorFileUpload='Number of files exceed Only 5 images allowed ';
            res.redirect('/admin/addproducts');
        } else {
            // Handle other Multer errors
            res.status(400).json({ error: 'File upload error' });
        }
    } else {
    // Other errors occurred, pass it to the next error handling middleware
        next(err);
    }
}

adminroute.get('/',auth.isLogoutAdmin,admincontroller.admin);
adminroute.post('/adminlogin',admincontroller.adminlogin);

adminroute.get('/adminhome',auth.isLoginAdmin,admincontroller.adminhome);
adminroute.get('/adminlogout',admincontroller.adminlogout);

adminroute.get('/forget',auth.isLogoutAdmin,admincontroller.forget);
adminroute.post('/forget',admincontroller.sendMail);

adminroute.get('/enterpassword',auth.isLogoutAdmin,admincontroller.enterpassword);

adminroute.post('/enterpassword',admincontroller.resetpassword);

adminroute.get('/userlist',auth.isLoginAdmin,admincontroller.userlist);

adminroute.get('/blockuser',auth.isLoginAdmin,admincontroller.blockuser);
adminroute.get('/unblockuser',auth.isLoginAdmin,admincontroller.unblockuser);

adminroute.get('/products',auth.isLoginAdmin,admincontroller.product);

adminroute.get('/addproducts',auth.isLoginAdmin,admincontroller.addproducts);
adminroute.post('/addproducts',upload.array('image',5),handleUploadErrorAdd,auth.isLoginAdmin,admincontroller.addproductspost);

adminroute.get('/deleteproduct',auth.isLoginAdmin,admincontroller.deleteproduct);

adminroute.get('/makeavailable',auth.isLoginAdmin,admincontroller.makeavailable);

adminroute.get('/editproduct',auth.isLoginAdmin,admincontroller.editproduct);

adminroute.post('/updateproducts',upload.array('image',5),handleUploadError,auth.isLoginAdmin,admincontroller.updateproducts);

adminroute.get('/category',auth.isLoginAdmin,admincontroller.category);

adminroute.get('/addcategory',auth.isLoginAdmin,admincontroller.addcategory);
adminroute.post('/addcategory',upload.single('image'),auth.isLoginAdmin,admincontroller.addcategorypost);

adminroute.get('/deletecategory',auth.isLoginAdmin,admincontroller.deletecategory);

adminroute.get('/editcategory',auth.isLoginAdmin,admincontroller.editcategory);
adminroute.post('/updatecategory',upload.single('image'),auth.isLoginAdmin,admincontroller.updatecategory);


adminroute.get('/orders',auth.isLoginAdmin,admincontroller.orders);
adminroute.get('/orderdetails',auth.isLoginAdmin,admincontroller.orderdetails);
adminroute.post('/updateorderstatus',auth.isLoginAdmin,admincontroller.updateorderstatus);

adminroute.get('/error',admincontroller.errorpage);
adminroute.get('/deleteimage',auth.isLoginAdmin,admincontroller.deleteimage);

adminroute.get('/coupon',auth.isLoginAdmin,admincontroller.coupon);
adminroute.post('/editcoupon',auth.isLoginAdmin,admincontroller.editcoupon);
adminroute.post('/addcoupon',auth.isLoginAdmin,admincontroller.addcoupon);

adminroute.get('/salesreport',auth.isLoginAdmin,admincontroller.salesreport);

adminroute.get('/todaysSales',auth.isLoginAdmin,admincontroller.todayssales);

adminroute.get('/getWeekSales',auth.isLoginAdmin,admincontroller.currentweeksales);

adminroute.get('/getMonthSales',auth.isLoginAdmin,admincontroller.currentmonthsales);

adminroute.get('/getYearSales',auth.isLoginAdmin,admincontroller.currentyearsales);

adminroute.post('/saleswithDate',auth.isLoginAdmin,admincontroller.saleswithdate);

adminroute.post('/salespdf',auth.isLoginAdmin,admincontroller.downloadSalesReport);

adminroute.get('*',admincontroller.unmatch);
  
module.exports=adminroute;