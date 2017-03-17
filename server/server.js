const mongoose = require("./db/mongoose.js").mongoose;
const Todo = require("./models/todo.js").Todo;
const User = require("./models/user.js").User;
const express = require("express");
const bodyParser = require("body-parser");


var app = express();

//This example demonstrates adding a generic JSON and urlencoded parser
//as a top-level middleware, which will parse the bodies of
//all incoming requests. This is the simplest setu
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var todo = new Todo({
    text: req.body.text
  });
  todo.save().then((doc)=>{
    res.send(doc);
  },(err)=>{
    res.status(315).send(err);
  });
});

app.listen(3000,()=>{
  console.log("start listening at port 3000");
})




// var Todo1 = new Todo({
//   text:"Cook dinner"
// });
//
// Todo1.save().then((res)=>{
//   console.log(res);
// },(err)=>{
//   console.log("failed to save todo ",err);
// })
//
// var Todo2 = new Todo({
//   text:"  Edit the video  ",
//   completed: true,
//   completedAt:123
// });
//
// Todo2.save().then((res)=>{
//   console.log(JSON.stringify(res,undefined,2));
// },(err)=>{
//   console.log("failed ",err);
// });
//
//
//
// var User1 = new User({
//   email: " 123@111  "
// });
//
// User1.save().then((res)=>{
//     console.log(res);
// },(err)=>{
//   console.log("failed",err);
// });
