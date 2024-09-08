const express = require("express")
const app = express()
const path = require("path")
const User = require("./models/user.models")
app

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"public")))

app.get("/",async(req,res)=>{
    res.render("index")
})
app.listen(3000,function(err){
    if(err) throw err
    console.log("server is running")
})