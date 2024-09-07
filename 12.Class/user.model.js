const { name } = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/12class");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type:String,
    },
    email:{
        type:String,
    }
})

const User = mongoose.model("User",userSchema);
module.exports = User