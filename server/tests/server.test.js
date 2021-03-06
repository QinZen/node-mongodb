const expect = require("expect");
const request = require("supertest");

const {app} = require("./../server.js");
const {Todo} = require("./../models/todo.js");
const {User} = require("./../models/user.js");

const jwt = require("jsonwebtoken");

const {ObjectID} = require("mongodb");

const {populateTodos,populateUsers,dummyUsers,dummyTodos} = require("./seed/seed.js");

beforeEach(populateTodos);
beforeEach(populateUsers);


describe("Post /todos",()=>{

  it("should create a new todo",(done)=>{
    var text = "Post text data";
    request(app)
      .post("/todos")
      .set("x-auth",dummyUsers[0].tokens[0].token)
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

  it("should not create todo with invalid body date",(done)=>{
    request(app)
      .post("/todos")
      .set("x-auth",dummyUsers[0].tokens[0].token)
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
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todos.length).toBe(1);
        expect(res.body.todos[0].text).toBe("first todo");
      })
      .end((err,res)=>{
        if(err)
          return done(err);
        done();
      });
  });
});

describe("Get /todos/:id",()=>{
  it("should return todo doc",(done)=>{
    request(app)
      .get(`/todos/${dummyTodos[0]._id.toHexString()}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(dummyTodos[0].text);
      })
      .end(done);
  });

  it("should not a return todo doc created by other user",(done)=>{
    request(app)
      .get(`/todos/${dummyTodos[1]._id.toHexString()}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });


  it("should return 404 if todo not found",(done)=>{
    var hexId = new ObjectID().toHexString();
    request(app)
      .get(`/todos/${hexId}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 for non-object ids",(done)=>{
    request(app)
      .get(`/todos/123abc`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("DELETE /todos/:id",()=>{
  it("should remove a todo",(done)=>{
    var id = dummyTodos[0]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe("first todo");
        expect(res.body.todo._id).toBe(id);
      })
      .end((err,res)=>{
        if(err) return done(err);
        Todo.find({
          _creator:dummyUsers[0]._id
        }).then((todos)=>{
          expect(todos.length).toBe(0);
          done();
        }).catch((e)=>{
          done(e);
        });
      });
  });

  it("should not remove a todo by other creator",(done)=>{
    // user1 want to delete todo2
    var id = dummyTodos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${id}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(404)
      .end((err,res)=>{
        if(err) return done(err);
        Todo.findById(id).then((todo)=>{
          expect(todo).toExist();
          expect(todo.text).toBe("second todo");
          done();
        }).catch((e)=>{
          done(e);
        });
      });
  });

  it("should return 404 if todo not found",(done)=>{
    request(app)
      .delete(`/todos/${new ObjectID().toHexString()}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it("should return 404 if objectID is invalid",(done)=>{
    request(app)
      .delete("/todos/123")
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});

describe("PATCH /todos/:id",()=>{

  it("should update the todo",(done)=>{
    var id = dummyTodos[0]._id.toHexString();
    var updatedText = "Test update data";
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .send({
        text: updatedText,
        completed: true
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(updatedText);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA("number");
      })
      .end(done);
  });

  it("should not update the todo by other user",(done)=>{
    var id = dummyTodos[0]._id.toHexString();
    var updatedText = "Test update data";
    request(app)
      .patch(`/todos/${id}`)
      .set("x-auth",dummyUsers[1].tokens[0].token)
      .send({
        text: updatedText,
        completed: true
      })
      .expect(404)
      .end(done);
  });

  it("should clear completedAt when todo is not completed",(done)=>{
    var hexId = dummyTodos[0]._id.toHexString();
    var updatedText = "Test updated data 2";
    request(app)
      .patch(`/todos/${hexId}`)
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .send({
        "text": updatedText,
        "completed": false
      })
      .expect(200)
      .expect((res)=>{
        expect(res.body.todo.text).toBe(updatedText);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist;
      })
      .end(done);
  });
});

describe("GET /users/me",()=>{
  it("should return user if authenticated",(done)=>{
    request(app)
      .get("/users/me")
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(200)
      .expect((res)=>{
        expect(res.body.email).toBe(dummyUsers[0].email);
        expect(res.body._id).toBe(dummyUsers[0]._id.toHexString());
      })
      .end(done);
  });


  it("should return 401 if not authenticated",(done)=>{
    request(app)
      .get("/users/me")
      .expect(401)
      .end(done);
  });
});

describe("POST /users",()=>{
  it("should create a user",(done)=>{
    var email = "123@fsdf.com";
    var password = "fsdgfdsgfd";
    request(app)
      .post("/users")
      .send({email,password})
      .expect(200)
      .expect((res)=>{
        expect(res.headers["x-auth"]).toExist();
        expect(res.body.email).toBe(email);
        expect(res.body._id).toExist();
      })
      .end((err,res)=>{
        if(err)
          return done(err);
        User.findOne({email}).then((user)=>{
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        })
      });
  });

  it("should return validation errors if request invalid",(done)=>{
    var email = "132@fsd.com";
    var password = "123";
    request(app)
      .post("/users")
      .send({email,password})
      .expect(400)
      .end(done);
  });

  it("should not create user if email in use",(done)=>{
     var email = dummyUsers[0].email;
     var password = dummyUsers[0].password;
     request(app)
      .post("/users")
      .send({email,password})
      .expect(400)
      .end(done);
  })

});

describe("POST /users/login",()=>{
  it("should login user and return auth token",(done)=>{
    request(app)
      .post("/users/login")
      .send({
        email: dummyUsers[0].email,
        password: dummyUsers[0].password
      })
      .expect(200)
      .expect((res)=>{
        expect(res.headers['x-auth']).toExist();
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(dummyUsers[0]._id).then((user)=>{
            expect(user.tokens[1]).toInclude({
              access:"auth",
              token:res.headers["x-auth"]
            });
            done();
        }).catch((e)=>done(e));
      });
  });

  it("should reject invalid login",(done)=>{
    request(app)
      .post("/users/login")
      .send({
        email:dummyUsers[1].email,
        password: "123467897564"
      })
      .expect(400)
      .expect((res)=>{
        expect(res.header["x-auth"]).toNotExist();
      })
      .end((err,res)=>{
        User.findById(dummyUsers[1]._id).then((user)=>{
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e)=>done(e));
      });
  });
});

describe("DELETE /users/me/token",()=>{
  it("should remove auth token on logout",(done)=>{
    request(app)
      .delete("/users/me/token")
      .set("x-auth",dummyUsers[0].tokens[0].token)
      .expect(200)
      .end((err,res)=>{
        if(err){
          return done(err);
        }
        User.findById(dummyUsers[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e)=>{
          done(e);
        })
      })
  });



});
