const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");
const {User} = require("./../models/user.js");

const dummyTodos = [{
  text: "first todo"
},{
  text: "second todo"
}];


beforeEach((done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(dummyTodos).then(()=>{
      done();
    });

  });

});


describe("Post /todos",()=>{
  var text = "Post text data";
  it("succeed to create todo",(done)=>{
    request(app)
      .post("/todos")
      .send({text})
      .expect(200)
      .expect((res)=>{    // customer assertion
        expect(res.body.text).toBe(text);
      })
      .end((err,res)=>{
        if(err) return done(e);

        Todo.find({text}).then((todos)=>{
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>{
          done(e);
        })
      });
  });

  it("succeed to add nothing",(done)=>{
    request(app)
      .post("/todos")
      .send({})
      .expect(315)
      .end((err,res)=>{
        if(err) return done(err);
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          done();
        });
      });
  });
});

describe("Get /todos",()=>{
  it("succeed to get todos",(done)=>{
    request(app)
      .get("/todos")
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(2);
        expect(res.body.todos[0].text).toBe("first todo");
        expect(res.body.todos[1].text).toBe("second todo");
      })
      .end((err,res)=>{
        if(err)
          return done(err);
        done();
      });
  });
});
