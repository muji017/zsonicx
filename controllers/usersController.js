const User = require('../model/usersModel');
const Product=require('../model/productModel');
const Category=require('../model/categoryModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Cart=require('../model/cartModel');
const Order=require('../model/orderModel');
const Coupon=require('../model/couponModel');
const dotenv=require('dotenv').config();
const Razorpay=require('razorpay');

const { RAZORPAY_ID_KEY,RAZORPAY_SECRET_KEY }= process.env;

const razorpayInstance=new Razorpay({

    key_id:RAZORPAY_ID_KEY,
    key_secret:RAZORPAY_SECRET_KEY
});
// razorpay ordering
const createOrder = async (req, res) => {
    try {
        const amount = Math.round(parseFloat(req.body.totalamount) * 100); // Convert the total amount to paise
        const options = {
            amount: amount,
            currency: 'INR',
            receipt: process.env.emailUser,
        };

        razorpayInstance.orders.create(options, async (err, order) => {
            if (!err) {
                res.status(200).send({
                    success: true,
                    msg: 'Order Created',
                    order_id: order.id,
                    amount: amount,
                    key_id: RAZORPAY_ID_KEY,
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                });
            } else {
                res.render('error', { error: err.message });
            }
        });
    } catch (error) {
        res.render('error', { error: error.message });
    }
};

// send verification mail
const sendVerifyMail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailpassword,
            },
        });
        const port = process.env.PORT;
        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: 'For verification mail',
            html:
        `<p>Hi ${name}, please click here to <a href="http://127.0.0.1:${port}/verify?id=${user_id}">verify</a> your mail.</p>`,
        };
    
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('mail sent ', info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};
//mail for reset password
const sendResetMail = async (name, email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.emailUser,
                pass: process.env.emailpassword,
            },
        });
        const mailOptions = {
            from: process.env.emailUser,
            to: email,
            subject: 'For Reset password',
            html: '<p>Hi ' + name + ' ,one time password is' + otp + '</p>',
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('mail sent ', info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};
// using bycrpt secure password
const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
};
// rendering error page
const errorpage=async(req,res)=>{
    try{
        res.render('error');
    }catch(error){
        console.log(error.message);
    }
};
//rendering login page
const login = async (req, res) => {
    try {
        let message
        if(req.session.message){
           message=req.session.message;
           req.session.message=null;
        }
        res.render('login',{message:message});
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// login post
const loginpost = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {

            const passmatch = await bcrypt.compare(password, userData.password);
            if (passmatch) {
                if (userData.is_verified === 0) { 
                    res.render('login', { message: 'please verify mail' });
                } else {
                    if(userData.is_blocked==1){
                        res.render('login',{message:'You are Blocked'});
                    }else{

                        req.session.user_id = userData._id;
                        req.session.user=userData;
                        res.redirect('/home');
                    }
                }
            } else {
                res.render('login', { message: 'Invalid password' });
            }
        }
        else {
            res.render('login', { message: 'Invalid User' });
        }

    } catch (error) {
        console.log(error.message);
        res.render('error', { error: error.message });
    }
};
// render signup
const signup = async (req, res) => {
    try {
        res.render('signup');
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// home page with sort filter search
const home = async (req, res) => {
    try {

        if(!req.query.key){
            const category=await Category.find({});
            res.render('home',{category:category});
        }
        else{
            const key = req.query.key;
            let sort='';
            if(req.query.sort){
                sort=req.query.sort;
            }
            let filter= req.query.filter;
            let fn='n';
            if(filter=='below1000'){
                fn='$lte';
            }
            else if(filter=='above1000'){
                fn='$gt';
            }
            let pricefilter={};
            if(fn!=='n'){
                pricefilter={price:{[fn]:1000}};
            }
            const limit=6;
            let page=1; 
            if(req.query.page){
                page=req.query.page;
            }

            const products = await Product.find({
                $and:[pricefilter,
                    {$or: [
                        { name: { $regex: '.*' + key + '.*', $options: 'i' } },
                        { brand: { $regex: '.*' + key + '.*', $options: 'i' } }
                    ]}
                ]})
                .sort({name:sort})
                .limit(limit * 1)
                .skip((page-1)*limit)
                .exec();
  
            const count = await Product.find({
                $and:[pricefilter,
                    {$or: [
                        { name: { $regex: '.*' + key + '.*', $options: 'i' } },
                        { brand: { $regex: '.*' + key + '.*', $options: 'i' } }
                    ]
                    }
                ]}).countDocuments();
     
            let totalpages=Math.ceil(count/limit);
            let currentpage=page;
  
  
            const category = await Category.find({});
            let issearch = 'inside search';
            
            var noitem='No items found pleace check categories';
            
      
            res.render('home', { category: category, product: products, issearch ,noitem,totalpages,currentpage,key});
        }
    
    }
    catch (error) {
        res.render('error', { error: error.message });
    }
};
// user singup post
const insertuser = async (req, res) => {
    try {
        const email = req.body.email;
        const mobile =req.body.mobile;
        const referedUser=await User.updateOne({reference:req.body.reference},{$inc:{wallet:50}});
        let walletrefer=0;
        if(referedUser){
              walletrefer=20;
        }
        const userData = await User.findOne({ email: email });
        const userphone = await User.findOne({ mobile: mobile });
        if (userData) {
            res.render('signup', { messages: 'Email already exists' });
        } 
        else if(userphone){
          res.render('signup', { messages: 'Phone number already exists' });
        }
        else {
            const spassword = await securePassword(req.body.password);
            const generateUniqueReference = (email) => {
              const randomPortion = Math.random().toString(36).substring(2, 10); // Generate a random portion
              const reference = email.replace('@', `-${randomPortion}@`); // Combine email and random portion
              return reference;
            };
            const reference = generateUniqueReference(req.body.email);
            let user;
            if (req.file && req.file.filename) { // Check if file is uploaded
                user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    image: req.file.filename,
                    password: spassword,
                    is_verified: 0,
                    reference:reference,
                    wallet:walletrefer
                });
            } else {
                user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mobile,
                    password: spassword,
                    is_verified: 0,
                    reference:reference,
                    wallet:walletrefer
                });
            }
            const data = await user.save();
            if (data) {
                sendVerifyMail(req.body.name, req.body.email, data._id);
                res.render('signup', { messages: 'Registered, please verify your email' });
            } else {
                res.render('signup', { messages: 'Registration failed' });
            }

        }
    } catch (error) {
        res.render('error', { error: error.message });
    }
};

// verifivation of mail
const verifyMail = async (req, res) => {
    try {
        await User.updateOne(
            { _id: req.query.id },
            { $set: { is_verified: 1 } }
        );
        res.render('login');
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
//forget password
const forget = async (req, res) => {
    try {
        res.render('forget');
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
//Sending mail and otp 
const forgetrequest = async (req, res) => {
    try {
        const OTP_EXPIRY_TIME = 60; // Replace with your actual OTP expiry time
        const remainingTime = OTP_EXPIRY_TIME;

        const email = req.body.emailforgot;
        const userData = await User.findOne({ email: email });
        
        if (req.headers['content-type'] === 'application/json') {
            // Handle JSON input
            if (userData) {
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 6; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                await User.updateOne(
                    { email: email },
                    { $set: { otp: OTP } }
                );
                sendResetMail(userData.name, email, OTP);
                res.json({ message: 'OTP sent successfully' });
            } else {
                res.status(400).json({ message: 'Invalid Email' });
            }
        } else {
            // Render the response for non-JSON input
            if (userData) {
                var digits = '0123456789';
                let OTP = '';
                for (let i = 0; i < 6; i++) {
                    OTP += digits[Math.floor(Math.random() * 10)];
                }
                await User.updateOne(
                    { email: email },
                    { $set: { otp: OTP } }
                );
                sendResetMail(userData.name, email, OTP);
                res.render('checkotp', { email: email, remainingTime: remainingTime });
            } else {
                req.session.message="Invalid Email";
                res.redirect('/login');
            }
        }
    } catch (error) {
        res.render('error', { error: error.message });
    }
};

// logout user and session destroy
const userlogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        res.render('error', { error: error.message });
    }
};

// verifying otp
const checkotp = async (req, res) => {
    try {
        const otp = req.body.otp;
        const userData = await User.findOne({ otp: otp });
        if (userData) {
            await User.updateOne(
                { _id: userData._id },
                { $set: { otp: '' } }
            );
            res.redirect('/resetpassword');
            res.json({ email:userData.email });
        } else {
          
            res.status(400).json({ message: 'Invalid otp' });
        }
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// reset password page rendering
const resetpassword = async (req, res) => {
    try {
        res.render('resetpassword');
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// reset password
const resetpasswordpost = async (req, res) => {
    const userEmail = req.body.email;
    const spassword = await securePassword(req.body.password);
    const updatedUser = await User.updateOne(
        { email: userEmail },
        { $set: { password: spassword } }
    );
    if (updatedUser) {
        req.session.message = 'Login with your new password';
        res.redirect('/login');
    }
};
// render otp login page
const otplogin = async (req, res) => {
    try {
        res.render('otplogin');
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// loging through otp
// const otploginpost = async (req, res) => {
//     try {
//         const OTP_EXPIRY_TIME = 60; // Replace with your actual OTP expiry time
//         const remainingTime = OTP_EXPIRY_TIME;

//         const email = req.body.email;
//         const userData = await User.findOne({ email: email });
//         if (userData) {
//             var digits = '0123456789';
//             let OTP = '';
//             for (let i = 0; i < 6; i++) {
//                 OTP += digits[Math.floor(Math.random() * 10)];
//             }
//             await User.updateOne(
//                 { email: email },
//                 { $set: { otp: OTP } }
//             );
//             sendResetMail(userData.name, email, OTP);
//             res.render('otpconform',{email:email,remainingTime:remainingTime});
//         } else {
//             res.render('otplogin', { message: 'Invalid email' });
//         }
//     } catch (error) {
//         res.render('error', { error: error.message });
//     }
// };

const otploginpost = async (req, res) => {
    try {
        const OTP_EXPIRY_TIME = 60; // Replace with your actual OTP expiry time
        const remainingTime = OTP_EXPIRY_TIME;
        
        let email = req.body.emailform;
        if(req.body.emailotp){
            email=req.body.emailotp;
        }
        else if(req.body.emailforgot)
        console.log(email);
        const userData = await User.findOne({ email: email });
        if (userData) {
            var digits = '0123456789';
            let OTP = '';
            for (let i = 0; i < 6; i++) {
                OTP += digits[Math.floor(Math.random() * 10)];
            }
            await User.updateOne(
                { email: email },
                { $set: { otp: OTP } }
            );
            sendResetMail(userData.name, email, OTP);
            res.json({ email: email, remainingTime: remainingTime });
        } else {
            res.status(400).json({ message: 'Invalid email' });
        }
    } catch (error) {
        res.render('error', { error: error.message });
    }
};

// render otp conform page 
const otpconform = async (req, res) => {
    try {
        res.render('otpconform');
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// otp conformation
const otpconformpost = async (req, res) => {
    try {
        const otp = req.body.otp;
        const userData = await User.findOne({ otp: otp });
        if (userData) {
            await User.updateOne({ email: userData.email }, { $set: { otp: '' } });
            req.session.user_id = userData._id;
            req.session.user=userData;
            res.redirect('/home');
        }
        else{
            res.render('login');
        }
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// list of products
const viewproduct = async (req, res) => {
  try {
    const allCategory = await Category.find({});
    let category_id = req.query.id;
    if(!category_id){

       category_id=allCategory[0]._id
    }
    if(req.session.category_id!==category_id){
      req.session.keyvalue=''
      req.session.category_id=category_id
    }
      let key = '';

      if (!req.query.key) {
         if(req.session.keyvalue)    key = req.session.keyvalue  
      }
      else if(req.query.key){
          req.session.keyvalue=req.query.key;
          key =req.query.key;
      }
           
      let sort = '';
      if (!req.query.sort1) {
        
         sort = req.session.sortvalue   
      }
      else if(req.query.sort1){
          req.session.sortvalue=parseInt(req.query.sort1);
          sort =parseInt(req.query.sort1);
      }
      let filter = req.query.filter;
      let fn = 'n';
      if (filter == 'below1000') {
          fn = '$lte';
      } else if (filter == 'above1000') {
          fn = '$gt';
      }
      let pricefilter = {};
      if (fn !== 'n') {
          pricefilter = { price: { [fn]: 1000 } };
      }

      let page = 1;
      const limit = 6;
      if (req.query.page) {
          page = req.query.page;
      }

  
      const category = await Category.find({ _id: category_id });
      const count = await Product.countDocuments({
          $and: [
              pricefilter,
              { category: category[0]._id },
              { is_delete: 0 },
              {
                  $or: [
                      { name: { $regex: '.*' + key + '.*', $options: 'i' } },
                      { brand: { $regex: '.*' + key + '.*', $options: 'i' } },
                  ],
              },
          ],
      });

      const product = await Product.find({
          $and: [
              pricefilter,
              { category: category[0]._id },
              { is_delete: 0 },
              {
                  $or: [
                      { name: { $regex: '.*' + key + '.*', $options: 'i' } },
                      { brand: { $regex: '.*' + key + '.*', $options: 'i' } },
                  ],
              },
          ],
      })
          .sort({price:sort})
          .limit(limit * 1)
          .skip((page - 1) * limit)
          .exec();

      let totalpages = Math.ceil(count / limit);
      let currentpage = page;

      if (req.headers['content-type'] === 'application/json') {
          // If the request is for JSON response
          res.json({
              product: product,
              category: category[0],
              allCategory: allCategory,
              totalpages,
              key,
              currentpage,
              sort
          });
      } else {
          // If the request is for rendering the view
          res.render('viewproduct', {
              product: product,
              category: category[0],
              allCategory: allCategory,
              totalpages,
              key,
              currentpage,
              sort
          });
      }
  } catch (error) {
      if (req.headers['content-type'] === 'application/json') {
          // If the request is for JSON response
          res.status(500).json({ error: error.message });
      } else {
          // If the request is for rendering the view
          res.render('error', { error: error.message });
      }
  }
};


// single product details
const viewproductdetails=async(req,res)=>{
    try{
        const product=await Product.findOne({_id:req.query.id}).populate('category');
        const allproduct=await Product.find({is_delete:0});
        res.render('viewproductdetails',{product:product,category:product.category[0],allproduct:allproduct});
    }catch(error){
        res.render('error', { error: error.message });
    }
};
// render cart page
const viewcart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userid: req.session.user_id }).populate('products.product');
        let coupon= await Coupon.find({});
        let category= await Category.find({});
        if (cart) {
            let products = cart.products;
       
            const cartData = products.map((prod) => {
                return {
                    prod_id: prod.product._id.toString(),
                    brand:prod.product.brand,
                    name: prod.product.name,
                    price: prod.product.price,
                    prodQuantity:prod.product.stock,
                    quantity: prod.quantity,
                    image: prod.product.image,
                    offer:prod.product.offer,
                    categid:prod.product.category[0]
                };
            });
            await Category.find({_id:cartData[0].categid});
            res.render('cart', { title: 'User Cart',category:category,cartData:cartData,coupon:coupon});
        } else {
            res.render('cart', { title: 'User Cart',category:'', message: 'Cart is empty',coupon:'' });
        }
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// action add to cart
const addtocart = async (req, res) => {
    try {
        const userid = req.session.user_id;
        const productid = req.query.p_id;
        const category_id=req.query.id;

        let usercart = await Cart.findOne({ userid: userid }); // Use findOne instead of find

        if (!usercart) {
            const newCart = new Cart({
                userid: userid,
                products: [], // Use "products" instead of "product"
            });
            await newCart.save();
            usercart = newCart;
        }

        const index = usercart?.products.findIndex(product => product.product == productid); // Use "productid" instead of "product"
        if (index === -1) {
            usercart.products.push({ product: productid, quantity: 1 });
        } else {
            usercart.products[index].quantity += 1;
        }
    
        await usercart.save();
        setTimeout(() => {
            res.redirect('/viewproduct?id=' + category_id);
        }, 1000);

    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// clear otp
const clearotp =async(req,res)=>{
    try{
        const userEmail = req.body.email;
        await User.updateOne(
            { email: userEmail },
            { $set: { otp:'' } }
        );
        res.json({ email:userEmail});
    }
    catch(error){
        res.render('error', { error: error.message });

    }
};
// delete a item from cart
const deletecart = async (req, res) => {
    try {
        const userId = req.session.user_id;
        const productId = req.query.prodId;


        let userCart = await Cart.findOne({ userid: userId });

        const index = userCart?.products.findIndex(
            (product) => product.product.toString() === productId
        );
    
        if (index==0) {
        // Remove the product from the products array
        await Cart.findOneAndDelete({ userid: userId });
        }
        else if(index!==-1){
            userCart.products.splice(index, 1);

            await userCart.save(); // Save the updated cart
           
            // console.log(`Product quantity decreased: ${userCart.products[index].quantity}`);
        }

        res.redirect('/cart');
    } catch (error) {
       
        res.render('error', { error: error.message });
    }
};
// cart update
const cartupdate = async (req, res) => {
  try {
      const userId = req.session.user_id;
      const productId = req.query.id; // Assuming you're passing the product ID in the request query parameters
      const quantity = req.query.quantity; // Assuming you're passing the updated quantity in the request query parameters

      const cart = await Cart.findOne({ userid: userId });

      if (cart) {
          const product = cart.products.find((item) => item.product.toString() === productId);

          if (product) {
              product.quantity = quantity; // Update the quantity to the desired value
              await cart.save();
          }
      }

      // Send a JSON response indicating success
      res.json({ success: true });
  } catch (error) {
      // Handle the error
      res.render("error",{ error: error.message });
  }
};


// view profile

const profile=async(req,res)=>{
    try{
        const userid=req.session.user_id;
        const user=await User.findOne({_id:userid});
        let exceed
        if(req.session.addressfull){
           exceed=req.session.addressfull
           req.session.addressfull=null
        }
        res.render('profile',{user:user,address:user.address,message:exceed});
    }catch(error){
        res.render('error', { error: error.message });
    }
};
//
const uploadprofpic=async(req,res)=>{
  try{
     const userid=req.session.user_id;
     const user=await User.updateOne({_id:userid},{$set:{image: req.file.filename}})
     if (user) {
      res.json({ success: true, message: 'Profile picture updated successfully' });
    } else {
      res.json({ success: false, message: 'Failed to update profile picture' });
    }

  }catch(error){
    res.render('error',{error:error.message})
  }
}
// adding address
const address=async(req,res)=>{
    try{
        let userid=req.session.user_id;
        const { head, street, city, pincode, state, country } = req.body;
        
        const user=await User.findOne({_id:userid});
        if(user.address.length<4){
            user.address.push({head:head,street:street,city:city,pincode:pincode,state:state,country:country});
             
            await user.save();
            res.redirect('/profile');
        }else{
          req.session.addressfull="Only four address you can add";
          res.redirect('/profile')
        }
    }catch(error){
        res.render('error', { error: error.message });
    }
};
// updating user details
const savechanges=async(req,res)=>{
    try{
        let userid=req.session.user_id;
        let user=req.body;
        await User.updateOne({_id:userid},
            {
                name:user.name,
                email:user.email,
                mobile:user.mobile 
            });
        res.redirect('/profile');

    }catch(error){

        res.render('error', { error: error.message });
    }
};
// delete a single address
const deleteaddress=async(req,res)=>{
    try{
        let index=req.query.index;
        let userid=req.session.user_id;
        let user=await User.findOne({_id:userid});
        if (index >= 0 && index < user.address.length) {
            // Remove the address at the specified index
            user.address.splice(index, 1);
      
            // Save the updated user with the removed address
            await user.save();
    
        }
        res.redirect('/profile');
    }catch(error){
        res.render('error', { error: error.message });
    }
};
// change password of user
const changepassword=async(req,res)=>{
    try{
        let userid=req.session.user_id;
        let newpassword= await securePassword(req.body.password);
        await User.updateOne({_id:userid},
            {
                password:newpassword 
            });
        res.redirect('/profile');
    
    }catch(error){
        res.render('error', { error: error.message });
    }
};
// checkout page
const checkout=async(req,res)=>{
    try{
        let user=await User.findOne({_id:req.session.user_id});
        let cart = await Cart.findOne({ userid: req.session.user_id }).populate('products.product');

        let products = cart.products;
    
        const cartData = products.map((prod) => {
            return {
                prod_id: prod.product._id.toString(),
                name: prod.product.name,
                price: prod.product.price,
                quantity: prod.quantity,
                image: prod.product.image
            };
        });
        const userAddress= user.address.map((addr)=>{
            return{
                head:addr.head,
                street:addr.street,
                city:addr.city,
                pincode:addr.pincode,
                state:addr.state
            };
        });
        const encodedString = encodeURIComponent(JSON.stringify(userAddress));
       
        const total=req.body.totalsend;
        res.render('checkout',{cartData:cartData,address:encodedString,user:user,totalamount:total});
    }catch(error){
        
        res.render('error', { error: error.message });
    }

};
// place order
const processpayment = async (req, res) => {
  try {
    const userid = req.session.user_id;
    const cartData = await Cart.findOne({ userid: req.session.user_id }).populate('products.product');
    const userdetails = req.body;
    const allproducts = await Product.find({});
    let payableamount=req.body.payableamount;
    if(req.body.checkboxset==='checked'){
      
     if(req.body.payableamount!=='Full amount from wallet'){
         payableamount=req.body.payableamount;
         await User.updateOne({_id:userid},{$set:{wallet:0}});
     }
     else{
        payableamount=0;
        let amountToSubtract=req.body.totalamount;
        await User.updateOne({_id:userid}, { $inc: { wallet: -amountToSubtract }});
     }
    }

    // Create a new order
    const newOrder = new Order({
      userid,
      items: cartData.products.map((product) => ({
        product: product.product._id,
        quantity: product.quantity,
      })),
      address: [
        {
          name: userdetails.name,
          phone: userdetails.mobile,
          email: userdetails.email,
          head: userdetails.head,
          street: userdetails.street,
          city: userdetails.city,
          pincode: userdetails.pincode,
          state: userdetails.state,
        },
      ],
      totalamount: parseFloat(payableamount),
      paymentmethod: userdetails.test,
      orderdate: Date.now(),
    });

    // Update product stock and save the new order to the database
    await Promise.all(
      cartData.products.map(async (item) => {
        const matchingProduct = allproducts.find((product) => product.id === item.product.id);
        if (matchingProduct) {
          const updatedStock = matchingProduct.stock - item.quantity;
          matchingProduct.stock = updatedStock;
          await matchingProduct.save();
        }
      })
    );

    await newOrder.save();
    await Cart.findByIdAndDelete(cartData._id);
    req.session.orderplace="Order place";
    res.redirect('/page');
  } catch (error) {
    res.render('error', { error: error.message });
  }
};

// order listing
const orders = async (req, res) => {
    try {
        let key = '';
        if (req.query.key) {
            key = req.query.key;
        }

        const limit = 6;
        let page = 1;
        if (req.query.page) {
            page = req.query.page;
        }
    
        const userid = req.session.user_id;
    
        const orderQuery = Order.find({ userid: userid }).sort({_id:-1}).populate('items.product');
        const orderCountQuery = Order.countDocuments({ userid: userid });

        const order = await orderQuery
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await orderCountQuery.exec();

        if (order) {
            let orderDetails = order.map(ord => {
              const orderDate = new Date(ord.orderdate); // Convert orderdate to a Date object
              const year = orderDate.getFullYear();
              const month = orderDate.getMonth() + 1;
              const date = orderDate.getDate();
              const currentDate = new Date(); // Get the current date
              
              const timeDifference = currentDate.getTime() - orderDate.getTime(); // Calculate the time difference in milliseconds
              const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24)); // Convert milliseconds to days
              
              let returnDateStatus;
              if (daysDifference > 7) {
                  returnDateStatus = 0;
                  
              } else {
                  returnDateStatus = 1;
              }
                return {
                    totalamount: ord.totalamount,
                    paymentmethod: ord.paymentmethod,
                    status: ord.status,
                    orderid:ord._id,
                    orderdate: `${date}/${month}/${year}`,
                    returnstatus:ord.return.status,
                    returnDateStatus:returnDateStatus,
                    products: ord.items.map(item => {
                        return { 
                            name: item.product.name,
                            brand:item.product.brand, 
                            image: item.product.image[0],
                            price: item.product.price,
                            quantity: item.quantity,
                            orderid:ord._id
                        };
                    }),
                    address: ord.address[0]
                }; 
            });

            let totalpages = Math.ceil(count / limit);
            let currentpage = page;
            
            res.render('order', {
          
                orderdata: orderDetails,
                products:orderDetails.products,
                totalpages: totalpages,
                currentpage: currentpage,
                key:key
            });
        } else {
            res.render('order', {
                message: 'No items ordered yet',
                orderdata: ''
            });
        }
    } catch (error) {

        res.render('error', { error: error.message });
    }
};

//order return 
const orderreturn=async(req,res)=>{
    try{
        let returnData=req.body;
        let order=await Order.findById(returnData.orderid);
        let currentDate=Date.now();
        let timeDiff=currentDate-order.delivereddate;
        let sevenDays= 7 * 24 * 60 * 60 * 1000; //Seven Days in milliseconds
        let withinSevenDays=timeDiff<=sevenDays;

        if(withinSevenDays){
            await Order.findByIdAndUpdate(returnData.orderid,{$set:{return:{status:true,reason:returnData.reason}}});
        }else{
            req.session.returnErr='You cannot return as the number of days exceeded';
        }
        res.redirect('/orders');
    }
    catch(error){
        res.render('error',{error:error.message});
    }
};

// cancel a order changing status to cancel
const cancelorder = async (req, res) => {
    try {
        let returnData=req.body;
        await Order.findByIdAndUpdate(returnData.orderidc,{$set:{status:'Order cancelled'}});
        res.redirect('/orders');

    } catch (error) {
        res.render('error', { error: error.message });
    }
};

const page=async(req,res)=>{
    try{
            if(req.session.orderplace){
                req.session.orderplace=null
                res.render('page');
            }
            else{
                res.redirect('/home')
            }
        
    }
    catch(error){
        res.render('error', { error: error.message });
    }
};

// search products
const searchproduct = async (req, res) => {
    try {
        const key = req.body.key;
        const products = await Product.find({
            '$or': [{name: { $regex:'.*'+key+'.*',$options:'i' }},
                {brand:{$regex: '.*'+key+'.*',$options:'i'}},
            ]
        });
        const allproducts=await Product.find({});
        const category= await Category.findOne({_id:products.category});
        const allcategory= await Category.find({});
  
        if(products){
            res.render('searchResult',{category:category,allCategory:allcategory,product:products,allproduct:allproducts});
        }
        else{
            res.render('searchResult',{category:category,allCategory:allcategory,allproduct:allproducts,message:'No search result found'});
        }
  
    } catch (error) {
        res.render('error', { error: error.message });
    }
};
// invoice 
const invoice=async(req,res)=>{
    try{
        const id=req.query.id;
    
        const order=await Order.findById(id).populate('items.product');

        if(order){
            const orderDate = new Date(order.orderdate); // Convert orderdate to a Date object
            const year = orderDate.getFullYear();
            const month = orderDate.getMonth() + 1;
            const date = orderDate.getDate();
            let orderdate=`${date}/${month}/${year}`;
            let products= order.items.map(item=>{
                return{
                    image:item.product.image[0],
                    name:item.product.name,
                    price:item.product.price,
                    brand:item.product.brand,
                    quantity:item.quantity
                };
       
            });
            res.render('invoice',{order:order,orderdate,products:products});
        }
    
    
    }catch(error){
        res.render('error',{error:error.message});
    }
};

// unmatch root
const unmatch=async(req, res) => {
    res.redirect('/home');
  }

module.exports = {
    insertuser,
    verifyMail,
    login,
    signup,
    home,
    loginpost,
    userlogout,
    forget,
    forgetrequest,
    checkotp,
    resetpassword,
    resetpasswordpost,
    otplogin,
    otploginpost,
    otpconform,
    otpconformpost,
    viewproduct,viewproductdetails,
    viewcart,addtocart,deletecart,cartupdate,
    profile,uploadprofpic,
    address,savechanges,
    deleteaddress,changepassword,
    checkout,processpayment,
    orders,cancelorder,page,
    orderreturn,
    clearotp,searchproduct,createOrder,
    errorpage,invoice,
    unmatch
};
