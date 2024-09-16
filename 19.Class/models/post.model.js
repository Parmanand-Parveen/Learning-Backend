const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    content: String,
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]


},{timestamps:true})

module.exports = mongoose.model("post",postSchema)