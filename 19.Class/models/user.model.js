const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/19class")

const userSchema = new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    posts:[{
        type : mongoose.Schema.Types.ObjectId,
        ref:"post"  
  }]
},{timestamps:true})

module.exports = mongoose.model("User",userSchema)