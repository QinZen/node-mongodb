const mongoose = require("./db/mongoose.js").mongoose;
const Todo = require("./models/todo.js").Todo;
const User = require("./models/user.js").User;
const express = require("express");
const bodyParser = require("body-parser");
const {ObjectID} = require("mongodb");

const port = process.env.PORT || 3000;

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

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({
      todos
    });
  },(err)=>{
    res.status(400).send(err);
  });
})

app.get('/todos/:id',(req,res)=>{
  var id = req.params.id;
  if(!ObjectID.isValid(id)){
    return res.status(404).send();
  }

  Todo.findById(id).then((todo)=>{
    if(todo){
      return res.send({todo});
    }
    res.status(404).send({});
  }).catch((err)=>{
    res.status(400).send({});
  });

});


app.listen(3000,()=>{
  console.log(`start listening at port ${port}`);
})


module.exports = {app};



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
