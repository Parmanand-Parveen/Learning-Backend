const express = require("express")
const app = express()






app.get("/",(req,res)=>{
    res.send("App started")})


 app.listen(3000,(req,res)=>{
     console.log("Server started at Port 3000")
 })   