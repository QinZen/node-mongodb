const {MongoClient,ObjectID} = require("mongodb");

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log(`Unable to connect to MongoDB server`);
  }
  console.log(`Connect to MongoDB server`);

  db.collection("Todos").find({_id: new ObjectID("58cb20d6939241037ca3ee69")}).count().then((count)=>{
    console.log("count: ",count);
  },(err)=>{
    console.log("failed to query ",err);
  });

  db.close();

});

//inset new doc into users (name,age,location)

//
// const MongoClient = require("mongodb").MongoClient;
//
//
// MongoClient.connect("mongodb://localhost:27017/test",(err,db)=>{
//   if(err){
//     return console.log("fail to connect to db");
//   }
//   console.log("connect to db server");
//   db.collection("AAAA").insertOne({
//       name:"Qing",
//       location: "NJ",
//       age:37
//   },(err,res)=>{
//     if(err){
//       return console.log("fail to insert data",err);
//     }
//     return console.log(JSON.stringify(res.ops,undefined,2));
//   })
//   db.close();
// });
