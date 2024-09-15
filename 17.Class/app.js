const express = require("express")
const app = express()
const path = require("path")
const bcrypt = require("bcrypt")
const cookie = require("cookie-parser")
const saltRound = 10
const userModel = require("./models/user.model")
const postModel = require("./models/post.model")
const jwt = require("jsonwebtoken")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))
app.set("view engine","ejs")


app.get("/",(req,res)=>{
    res.render("index.ejs")
})

app.get("/signup",(req,res)=>{
     res.render("signup")
})


app.get("/login",(req,res)=>{
     res.render("login")
})

app.post("/create/account",async (req,res)=>{
    const {username,email,password} =req.body;
    const exitingUser = await userModel.findOne({email})
    if(exitingUser){
        return res.send("User already Exist")
    } else{
        bcrypt.hash(password,saltRound, async (err,hased)=>{
            const user = await userModel.create({
                username,
                email,
                password:hased,
                
            })  
            const token = jwt.sign({email:user.email},"shhh")
            res.cookie("token",token)
            res.redirect("/")
        })
        
    }
})

app.post("/logins",async (req,res)=>{
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    console.log(user)
    if(user){
        const hashedpassword = user.password
        bcrypt.compare(password,hashedpassword, (err,result)=>{
            console.log(result)
            if(result){
                const token = jwt.sign({email:user.email},"shhh")
                res.cookie("token",token)
                res.redirect("/")
            } else{
                res.send("Invalid Credentials")
            }
        })
    } else{
        res.send("Invalid Credentials")
    }
})

app.get("/profile",isLoggedIn,(req,res)=>{
    console.log(req.body)
    res.send("Welcome to profile Page")
})

function isLoggedIn(req,res,next){
    console.log(req.cookies)
    const token = req.cookies.token
    if(token){
        const user = jwt.verify(token,"shhh")
        req.user = user
        next()
    } else{
        res.send("You must be loged in")
    }
}


app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect('/')
})



app.listen(3000,(req,res)=>{
    console.log("Server started at Port 3000")
})