
const validator = require("validator");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const _ = require("lodash");

var UserSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    trim: true,
    minlength:1,
    unique: true,
    validate:{
      validator:(value)=>{
        return validator.isEmail(value);
      },
      message: '{VALUE} is not a valid email'
    }
  },
  password:{
    type: String,
    required: true,
    minlength: 6
  },
  tokens:[{
    access:{
      type: String,
      required: true
    },
    token:{
      type: String,
      required: true
    }
  }]
});


//override
UserSchema.methods.toJSON = function (){
  var user = this;
  var userObject = user.toObject();
  return _.pick(userObject,["_id","email"]);
}

UserSchema.methods.generateAuthToken = function (){
  var access = "auth";
  var user = this;
  var token = jwt.sign({_id:user._id.toHexString(),access},"123abc").toString();
  user.tokens.push({access,token});
  return user.save().then(()=>{
    return token;
  });

};


var User = mongoose.model("User",UserSchema);

module.exports = {User};
