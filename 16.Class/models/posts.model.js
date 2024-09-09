const mongoose  = require("mongoose")


const postSchema = new mongoose.Schema({
      user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      post: String
})

module.exports = mongoose.model("post",postSchema)