const express = require("express")
const app = express()
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const saltRound = 10
const userModel = require("./models/user.model")
const postModel = require("./models/post.model")
const upload = require("./configs/multerconfig")


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))
app.use(cookieParser())

app.set("view engine", "ejs")

app.get("/",(req,res)=>{
    res.render("index")
})

app.get("/signup",isLoggedout,(req,res)=>{
    res.render("signup")
})


app.get("/login",isLoggedout,(req,res)=>{
    res.render("login")
})


app.post("/signup", async(req,res)=>{
    const {username,email,password} = req.body
    const exsistingUser = await userModel.findOne({email})
    if(exsistingUser){
        res.send("User already existing")
    } else {
        bcrypt.hash(password,saltRound,async (err,hashedPassword)=>{
             const user = await userModel.create({
                username,
                email,
                password:hashedPassword
             })
             const token = jwt.sign({email:user.email,id:user._id},"222")
             res.cookie("token",token)
             res.redirect("/profile")
        })
    }
})


app.post("/logins",async (req,res)=>{
    const {email, password} = req.body
    const user = await userModel.findOne({email})
    if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token = jwt.sign({email:user.email,id:user._id},"222")
                res.cookie("token",token)
                res.redirect("/profile")
            }else{
                res.send("Somthing Went wrong")
            }
        })
    } else {
        res.send("Somthing Went wrong")
    }
})

isLoggedIn = (req,res,next)=>{
    const token = req.cookies.token
    if(token){
        const user = jwt.verify(token,"222")
        req.user = user
        next()
    } else {
        res.send("You must log in")
    }
}

app.post("/post",isLoggedIn,async (req,res)=>{
    const user = await userModel.findById(req.user.id)
    const post = await postModel.create({
        user:user._id,
        content:req.body.content
    })
    user.posts.push(post._id)
    await user.save()
    res.redirect("/profile")
})

app.get("/profile" ,isLoggedIn,async (req,res)=>{
    const user = await userModel.findById(req.user.id).populate("posts")
    res.render("profile",{user:user})
})

app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/")
})

app.get("/edit/:id",isLoggedIn,async (req,res)=>{
    const post = await postModel.findById(req.params.id)
    res.render("edit",{post:post})
})

app.post("/edit/:id",isLoggedIn,async (req,res)=>{
    const post = await postModel.findById(req.params.id)
    post.content = req.body.content
    await post.save()
    res.redirect("/profile")
})

app.get("/like/:id",isLoggedIn,async (req,res)=>{
    const post = await postModel.findById(req.params.id)
    const user = await userModel.findById(req.user.id)

    if(post.like.includes(req.user.id)){
        const index = post.like.indexOf(req.user.id)
        post.like.splice(index,1)
    }   

    else {
        post.like.push(req.user.id)
    }

    await post.save()
    res.redirect("/profile")
})

function isLoggedout(req,res,next){
    const token = req.cookies.token
    if(!token){
        next()
    } else {
        res.redirect("/profile")
    }
}

app.get("/delete/:id",isLoggedIn,async (req,res)=>{
    const User = await userModel.findById(req.user.id)
    const index = User.posts.indexOf(req.params.id)
    User.posts.splice(index,1)
    const post = await postModel.findByIdAndDelete(req.params.id)
    await User.save()
     
    res.redirect("/profile")
})

app.get("/upload",isLoggedIn,(req,res)=>{
    res.render("upload")
})

app.post("/upload/img",isLoggedIn,upload.single("image"),async (req,res)=>{
    const user = await userModel.findById(req.user.id)
     user.image = req.file.filename
    await user.save()
    res.redirect("/profile")
})

app.listen(3000,()=>{
    console.log("Server started at http://localhost:3000/")
})