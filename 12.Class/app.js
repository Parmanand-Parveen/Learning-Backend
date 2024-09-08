const express = require("express")
const app = express()
const path = require("path")
const User = require("./user.model")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")
app.use(express.static(path.join(__dirname,"public")))



app.post("/create", async(req,res)=>{
    const {name ,age,email} = req.body;
    const users = await User.create(
        {
            name,age,email
        })
        res.redirect("/")
    })
app.get("/",async(req,res)=>{
    const users = await User.find()  
        res.render('index.ejs',{users:users})
    })
app.get("/edit/:id",async(req,res)=>{
    const user = await User.findById(req.params.id)
    res.render("edit.ejs",{user:user})
})

app.post("/edited/:id",async(req,res)=>{
       await User.findByIdAndUpdate(req.params.id,req.body)
      res.redirect("/")
})

app.get("/delete/:id",async(req,res)=>{
    const user = await User.findByIdAndDelete(req.params.id)
    res.redirect("/")
})





app.listen(3000,(req,res)=>{
    console.log("App started")
})