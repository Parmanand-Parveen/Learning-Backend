const express = require("express");
const app =  express();
const path = require("path");
const bcrypt = require("bcrypt")
const saltRound = 10
const userModel = require("./models/user.model")
const postModel = require("./models/post.model")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser())
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("index");
});

app.get("/signup",(req,res)=>{
    res.render("signup")
})

app.post("/signup",async (req,res)=>{
    const {username,email,password} = req.body
    let existingUser = await userModel.findOne({email})
    if(existingUser){
        res.send("User allready exists")
    }else{
       bcrypt.hash(password, saltRound,async (err,hashedPassword)=>{
        const user = await userModel.create({
            username,
            email,
            password:hashedPassword
        })
        const token = jwt.sign({email:user.email,id:user._id},"111")
        res.cookie("token",token)
        res.redirect("/profile")
       })
    }

})


app.get("/profile",isLoggedIn, async (req,res)=>{
     const {email , id} = req.user
     const user = await userModel.findOne({email}).populate("posts")
     res.render("profile",{user:user})

})

function isLoggedIn(req,res,next){
    const token = req.cookies.token
    if(token){
        const user = jwt.verify(token,"111")
        req.user = user
        next()
    } else {
        res.send("You must be logged In first")
    }
}

app.post("/post",isLoggedIn, async(req,res)=>{
    const {email,id} = req.user
    const user = await userModel.findOne({email})
    const post = await postModel.create({
        user:user._id,
        content:req.body.content
   })
   user.posts.push(post._id)
   await user.save()
   res.redirect("/profile")
   
})

app.get("/like/:id",isLoggedIn, async (req,res)=>{
    const {email,id} = req.user
    let post =  await postModel.findOne({ _id:req.params.id}).populate("user") 
    let user = await userModel.findOne({email})
    if(post.like.indexOf(user._id)==-1){
        post.like.push(user._id)
    } else {
        post.like.splice(post.like.indexOf(user._id),1)
    }

    post.save()
    res.redirect("/profile")
})

app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/")
})

app.get("/edit/:id",isLoggedIn, async(req,res)=>{
    let post =  await postModel.findOne({ _id:req.params.id}).populate("user") 

    res.render("edit",{post})
})
app.post("/edit/:id",isLoggedIn, async(req,res)=>{
    let post =  await postModel.findOneAndUpdate({ _id:req.params.id},{content:req.body.content})
    
    res.redirect("/profile")
})

app.get("/login",(req,res)=>{
    res.render("login")
})


app.post("/logins",async (req,res)=>{
    const {email,password} = req.body
    const user = await userModel.findOne({email})
    if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token = jwt.sign({email:user.email,id:user._id},"111")
                res.cookie("token",token)
                res.redirect("/profile")
            } else {
                res.send("Somthing went wrong")
            }
        })
    } else {
        res.send("Something went wrong")
    }
})





app.listen(3000, () => {
    console.log("Server is running on port 3000");
})