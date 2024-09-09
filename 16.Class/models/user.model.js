const mongoose = require("mongoose")

mongoose.connect("mongodb://127.0.0.1/27017/16class");

const userSchema = new mongoose.Schema({
    
        name:String,
        age:Number,
        email:String,
        posts:[{
            type: mongoose.Schema.Types.ObjectId,
            ref:"post"
        }]
    
})

 module.exports = mongoose.model("User",userSchema)