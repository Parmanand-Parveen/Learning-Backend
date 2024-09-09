const express = require("express")
const userModel = require("./models/user.model")
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
})

app.listen(3000,(err,data)=>{
    console.log("Server started")
})