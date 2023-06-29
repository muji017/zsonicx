// var countSegments = function(s) {
//     let count=1
//     for(let i=0;i<s.length;i++){
//         if(s[i]==' '){
//             count=count+1
//         }
//     }
//     return count
// };
// var countSegments = function(s) {
//     if(s.trim().length<1) {
//         return 0
//     }
//     s=s.trim()
//     let count=1
//     for(let i=0;i<s.length;i++){
//          if((s[i]==' ')&&s[i-1]!=' '){
//             count=count+1
//         }

//     }
//     return count

// };
// let str=', , , ,        a, eaefa'
// console.log(countSegments(str));
// var duplicateZeros = function(arr) {
//     for(let i=0;i<arr.length;i++){
//         if(arr[i]==0){
//             for(let j=arr.length-1;j>i;j--){
//                 arr[j]=arr[j-1]
//             }
//             i++
//         }
//     }
//     return arr
// };
// let arr=[1,0,2,3,0,4,5,0]
// console.log(duplicateZeros(arr));
// var hasGroupsSizeX = function(deck) {
   
// };
// let deck=[1,1,2,2,3,3,3,4,4]
// console.log(hasGroupsSizeX(deck));


// <!doctype html>
// <html lang="en">
//   <head>
//     <meta charset="utf-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1">
//     <title>My page</title>
//     <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-KK94CHFLLe+nY2dmCWGMq91rCGa5gtU4mk92HdvYe+M/SXH301p5ILy+dN9+nJOZ" crossorigin="anonymous">
//     <link rel="stylesheet" href="layout.ejs">
// </head>
//   <body>
//     <div style="background-color: rgb(6, 6, 28); padding-left: 50px;">
//         <h6 style="color:#fff;font-size: smaller; font-family: popins;font-style: oblique;"> Enjoy shoping with <a style="color: gold;">Z</a>sonicx</h6>
//      </div>
// <nav class="navbar navbar-expand-lg navbar-light bg-primary p-2" style="--bs-bg-opacity: .05; margin-top: -15px;">
//     <a class="navbar-brand" href="#"><h2 style="color: #fff;font-family: popins;"><a style="color: gold;">Z</a>sonicx</h2></a>
//     <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//       <span class="navbar-toggler-icon"></span>
//     </button>
  
//     <div class="collapse navbar-collapse" id="navbarSupportedContent",>
//       <ul class="navbar-nav mr-auto">
//         <li class="nav-item active">
//           <a class="nav-link" href="/admin/adminhome" style="color: #fff;">Dashboard</a>
//         </li>
//       </ul>
//       <ul class="navbar-nav mr-auto">
//         <li class="nav-item ">
//           <a class="nav-link" href="/admin/userlist" style="color: #fff;">Users</a>
//         </li>
//       </ul>
//       <ul class="navbar-nav mr-auto">
//         <li class="nav-item ">
//           <a class="nav-link" href="/admin/products" style="color: #fff;">Products</a>
//         </li>
//       </ul>      
//       <ul class="navbar-nav mr-auto">
//         <li class="nav-item ">
//           <a class="nav-link" href="/admin/category" style="color: #fff;">Category</a>
//         </li>
//       </ul>
//       <ul class="navbar-nav mr-auto">
//         <li class="nav-item" >
//           <a class="nav-link" href="#" style="color: #fff;">Salesreport</a>
//         </li>
//       </ul>
//        <ul class="navbar-nav mr-auto">
//         <li class="nav-item">      
//        <div class="btlogout" style="margin-top:-30px; margin-left: 25px;margin-bottom: -20px;" >  <a href="/admin/adminlogout">
//         <span></span>
//         <span></span>
//         <span></span>
//         <span></span>
//         Logout
//       </a>
//       </div>
//       </li></ul>
//     </div>
//   </nav>
//   <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.7/dist/umd/popper.min.js" integrity="sha384-zYPOMqeu1DAVkHiLqWBUTcbYfZ8osu1Nd6Z89ify25QV9guujx43ITvfi12/QExE" crossorigin="anonymous"></script>
// <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/js/bootstrap.min.js" integrity="sha384-Y4oOpwW3duJdCWv5ly8SCFYWqFDsfob/3GkgExXKV4idmbt98QcxXYs9UoXAB7BZ" crossorigin="anonymous"></script>
//   </body>
//   </html>

// var totalMoney = function(n) {
//   let k=1
//   for(let i=0;i<n;i++){
//       k=k+i
//   }
//   return k
// };
// let n=4
// console.log(totalMoney(n));
// var uniqueOccurrences = function(arr) {
//   let occ=[]
//   let count=1
//   k=0
//   let ar=arr.sort((a,b)=>{return a-b})
//   for(let i=0;i<ar.length;i++){
//       if(ar[i]===ar[i+1]){
//         occ[k]=count
//           count++
//       }
//       else {k++
//         count=1
//       }
      
//       console.log(occ);
//   }
//   let oc=occ.sort((a,b)=>{return a-b})
//   for(let j=0;j<oc.length;j++){
//       if(oc[j]==oc[j+1]){
//           return false
//       }
//   }
//   return true
// };
// let arr=[3,3,3,2,2,1]
// console.log(uniqueOccurrences(arr));
// var countDigits = function(num) {
//   var arr = num.toString().split('');
//   let count=0
//   let k=0
//   for(let i=0;i<arr.length;i++){
//        if(num%arr[i]==0)
//        count++
//       }
//   return count
// };

// // console.log(countDigits(121));
// var findKthPositive = function(arr, k) {
//   let m=1
//   let l=1
//   let i=0
//   while(l!==k){
//       if(arr[i]!==m){
//           l++
//           k++
          
//       }
//       else{
//           l++
//       }
//       m++
//       i++
//   }
//     return m
  
// };
// console.log(findKthPositive([2,3,4,7,11],5));
// var similarPairs = function(words) {
//     let count=0
//     let arr=[]
//     for(let i=0;i<words.length;i++){
//         arr[i]=words[i].split('').sort()
//     }
//     for(let i=0;i<arr.length;i++){
//          for(let j=i+1;j<arr.length;j++){
//             if(arr[i][i]===arr[j][j])
//             {
//                 count++
//             }
//          }
//     }
//     return count
// };
// let words=['abc','k','ab','ca']
// console.log(similarPairs(words));
// var arrayStringsAreEqual = function(word1, word2) {
//     let n
//     if(word1.length<word2.length){
//         n=word2.length
//     }else{
//         n=word1.length
//     }
//     let w1=[]
//     let w2=[]
//     let k=0
    // for(let i=0;i<n;i++){
    //    w1[k]=word1[i].split('')
    //    w2[k]=word2[i].split('')
    //    k++
    // }
    // w1=word1.join('')
    // w2=word2.join('')

    // console.log("word1",w1);
    // console.log("word2",w2);
    // if(w1===w2){
    //     return true
    // }
    // else{
    //     return false
    // }

// };
// let word1=['abc','c']
// let word2=['c','ab']
// arrayStringsAreEqual(word1,word2)
// var searchMatrix = function(matrix, target) {
    
//     for(let i=0;i<=matrix.length;i++){
//         for(let j=0;j<=matrix.length;j++){
//             if(matrix[i][j]===target)
//             {
                
//             }
//         }
//     }
//     return matrix.length
// };
// let matrix=[[-1,3]]
// console.log(searchMatrix(matrix,3));
// var mostFrequentEven = function(nums) {
//     let count=0
//     let feq=new Map([])
//     let k=0
//     nums=nums.sort((a,b)=>{return a-b})
//     for(let i=0;i<nums.length;i++){
//         if(nums[i]%2===0){    
//         if(nums[i]===nums[i+1])
//         {
            
//            feq.set(nums[i],count)
//            count++
//         }
//         }
//     }
//     return feq
// };
// let nums=[1,3,3,4,4,1,1]
// console.log(mostFrequentEven(nums));
// var largeGroupPositions = function(s) {
//     let out=[[]]
//     let a=0
//     let count=0
//     for(let i=0;i<s.length;i++){
//          if(s[i]==s[a]){
//            count++
//          }
//          if(s[i]!=a){
//             if(count>=3){
//                 out.push([a,i-1])
//             }
//             a=i
//          }
         

//         }
        
       
//     return out
// };
// let s='aabbxxxxyyy'
var getNoZeroIntegers = function(n) {
    let m=n-1
    let x=1
    let arr=[1,1]
    while(m+x!==n)
    if(m.toString().includes('0')){
        
       m--
        x++
    }
    else if(m+x==n){
        return arr=[m,x]
    }
};
console.log(getNoZeroIntegers(71));