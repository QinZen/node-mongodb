const {Todo} = require("./../server/models/todo.js");
const {User} = require("./../server/models/user.js");
const {ObjectID} = require("mongodb");
const {mongoose} = require("./../server/db/mongoose.js");


Todo.remove({}).then((res)=>{
  console.log(res);
});

Todo.findByIdAndRemove("58d14b7716922673675ffef2").then((res)=>{
  console.log(res);
});
