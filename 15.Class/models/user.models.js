const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/15class");

const userSchema = new mongoose.Schema({
   name:String,
   age:Number,
   password:String,
   email:String,
   image:String
});


const User = mongoose.model("User",userSchema);
module.exports = User
