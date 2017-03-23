const {SHA256} = require("crypto-js");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

var password = "123456789";

// bcrypt.genSalt(10,(err,salt)=>{
//   bcrypt.hash(password,salt,(err,res)=>{
//     console.log(res);
//   })
// })

var hash = "$2a$10$vQPpGUoIHx2bPQ8DyKhSTOu67ohTvRdh6m4t3pmB09Ukj.GZRgrIW";

bcrypt.compare(password,hash,(err,res)=>{
  console.log(res);
})


//
// var data = {
//   id: 9
// };
//
// var token = jwt.sign(data,"123abc");
// console.log(token);
//
// var decoded = jwt.verify(token,"123abc");
// console.log("decoded: ",decoded);


// var message = "I am user number 3";
// var hash = SHA256(message).toString();
//
//
// console.log("hash:  ",hash);
//
// var data = {
//   id:4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// //token.data.id = 5;
// var resulthash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
//
// if(resulthash === token.hash){
//   console.log("Data was not changed");
// }else{
//   console.log("Data was changed, do not trust");
// }
