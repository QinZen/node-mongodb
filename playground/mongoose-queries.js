const {mongoose} = require("./../server/db/mongoose.js");
const {Todo} = require("./../server/models/todo.js");
const {ObjectID} = require("mongodb");

var id = "59ceba00c5a5dea";

if(!ObjectID.isValid(id)){
  console.log("Id not valid");
}

// Todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log("Todos: ",todos);
// });
//
// Todo.findOne({
//   _id:id
// }).then((todo)=>{
//   console.log("Todos: ",todo);
// });

// Todo.findById(id).then((todo)=>{
//   if(!todo)
//     console.log("Id not found");
//   console.log("Todos: ",todo);
// }).catch((e)=>{
//   console.log(e);
// });
