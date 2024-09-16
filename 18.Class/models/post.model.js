const mongoose = require("mongoose")


const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content:String,
    Likes : [{
         type:mongoose.Schema.Types.ObjectId,
         ref:"User" 
    }]
})


module.exports = mongoose.model("post",postSchema)
