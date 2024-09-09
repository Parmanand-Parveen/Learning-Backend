const express = require("express")
const userModel = require("./models/user.model")
const postModel = require("./models/posts.model")
const app  = express()

app.get("/",(req,res)=>{
    res.send("App started")
})


app.get("/create",async (req,res)=>{
    const user = await userModel.create({
        name:"Parmanand",
        age:23,
        email:"kuch toh hai"
    })
    res.send(user)
})

app.get("/create/post",async (req,res)=>{
    const post= await postModel.create({
        user:"66de7935d2c805fc64835f02",
        post:"Post hai yaha pe"
    })
    const user = await  userModel.findOne({_id:"66de7935d2c805fc64835f02"})
    user.posts.push(post._id);
    await user.save()
     res.send({post,user})
    
})

app.listen(3000,(err,data)=>{
    console.log("Server started")
})