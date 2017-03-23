
const {ObjectID} = require("mongodb");
const {Todo} = require("./../../models/todo");
const {User} = require("./../../models/user");

const jwt = require("jsonwebtoken");

const dummyTodos = [{
  _id : new ObjectID(),
  text: "first todo"
},{
  _id : new ObjectID(),
  text: "second todo",
  completed: "true",
  completedAt: 333
}];


var userOneID = new ObjectID();
var userTwoID = new ObjectID();

const dummyUsers = [
  {
    _id: userOneID,
    email: "d26842684@hotmail.com",
    password: "123456",
    tokens:[{
      access: "auth",
      token: jwt.sign({
        _id: userOneID,
        access: "auth"
      },"123abc")
    }]

  },{
    _id:userTwoID,
    email: "c26842684@123.com",
    password: "4897945"
  }
];

const populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
    return Todo.insertMany(dummyTodos);
  }).then(()=>done());
}

const populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var user1 = new User(dummyUsers[0]).save();
    var user2 = new User(dummyUsers[1]).save();

    return Promise.all([user1,user2]);
  }).then(()=>done());
}

module.exports = {dummyTodos,dummyUsers,populateTodos,populateUsers};
