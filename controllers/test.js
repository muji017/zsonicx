// const addToCart=async(req,res)=>{
//     try {
//         let prodId=req.query.proId
//         let userId = req.session.userId
//         // let username=req.session.username
//         // let session=req.session.loggedIn
//         // if(req.session.userId){
//         let userCart=await Cart.findOne({userid:userId})
//         if(!userCart){
//             const newCart = new Cart({userid:userId,products:[]})
//             await newCart.save()
//             userCart = newCart
//         }
//         // console.log(userCart)

//         const productIndex=userCart?.products.findIndex((product)=>product.productid==prodId)
//         console.log(productIndex)
//         if(productIndex==-1){
//             userCart.products.push({productid:prodId,quantity:1})
//         }else{
//             userCart.products[productIndex].quantity+=1
//         }
//         await userCart.save()
        
//         res.redirect('/productload'+'?id='+prodId)
//         // if(userCart){
//         //     const productIndex=userCart?.products.findIndex((product)=>product.productid===prodId)
//         //     if(productIndex===-1){
//         //         userCart.products.push({prodId,quantity:1})
//         //     }else{
//         //         userCart.products[productIndex].quantity+=1
//         //     }
//         //     await userCart.save()
//         //     // await Cart.updateOne({userid:req.session.userId},{$push:{products:prodId}})
//         // }else{
//         //     let newCart=new Cart({
//         //         userid:req.session.userId,
//         //         products:[]
//         //     })
//         //     await newCart.save()
//         // }
//     // }else{
//     //     res.redirect('/login')
//         // }
//     } catch (error) {
//         console.log(error.message)
//     }
// }

const userCart=async(req,res)=>{
    try {
        let username=req.session.username
        let session=req.session.loggedIn
        let cart= await Cart.findOne({userid:req.session.userId}).populate("products.productid")
        if (cart) {

            let products=cart.products
            // console.log(products);
            const cartData= products.map(prod => {
                    return({
                        prod_id: prod.productid._id.toString(),
                        name: prod.productid.name,
                        price: prod.productid.price,
                        quantity: prod.quantity,
                        image: prod.productid.image
                    })
                })
                console.log(cartData.quantity)
            res.render('user/user-cart',{title:"User Cart",cartData,username,session})
        }else{
            res.render('user/user-cart',{title:'User Cart',message:"cart is empty"})
        }
        } catch (error) {
        console.log(error.message)
    }
}
// insert product
const insertProduct=async(req,res)=>{
    try {
        const product=new Product({
            name:req.body.name,
            price:req.body.price,
            stock:req.body.stock,
            category:req.body.category,
            description:req.body.description,
            // image:req.files.map((file)=>file.filename)
        })
        const croppedImages = [];
            for (let file of req.files) {
            const croppedImage = `cropped_${file.filename}`;

            await sharp(file.path)
                .resize(500, 600, { fit: "cover" })
                .toFile(`./public/images/products/${croppedImage}`);

            croppedImages.push(croppedImage);
            }

            product.image=croppedImages
        const productData =await product.save()
        if(productData){
            res.redirect('/admin/adminproduct')
        }else{
            console.log("error upload")
        } 
    } catch (error) {
        console.log(error.message)
    }
}