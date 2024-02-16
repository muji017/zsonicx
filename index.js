const mongoose=require('mongoose');
mongoose.connect('mongodb+srv://mujeebrahmanps01707:ruzo4mjVv0WDCyor@cluster0.tpfodys.mongodb.net/',
console.log('connnnnnected'));
const userroute=require('./routes/userRoute');
const adminroute=require('./routes/adminRoute');
const nocache=require('nocache');
// var dotenv=require('dotenv').config();

// const userlogin=require('./routes/userRoute/login')


 
const express=require('express');
const path=require('path');
const app=express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(nocache());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public',express.static('public'));


app.use('/',userroute);
app.use('/login',userroute);
app.use('/admin',adminroute);



const PORT=process.env.PORT||3000;

app.listen(PORT,()=>{
    console.log('Server in port '+PORT);
});