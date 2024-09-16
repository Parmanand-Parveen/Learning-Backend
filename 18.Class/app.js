const express = require("express");
const userModel = require("./models/user.model");
const path = require("path");
const saltRound = 10;
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const postModel = require("./models/post.model");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/submit", async (req, res) => {
  const { username, email, password } = req.body;
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    res.send("User Already Exist");
  } else {
    bcrypt.hash(password, saltRound, async (err, hashedPassword) => {
      const user = await userModel.create({
        username,
        email,
        password: hashedPassword,
      });
      const token = jwt.sign({email:user.email,id:user._id},"555")
      res.cookie("token",token)
      res.redirect("/profile")  
    });
  }
});

app.get("/profile",isLoggedIn,async (req,res)=>{
     const {email,id}=req.user
     const user = await userModel.findOne({email}).populate("posts")
     res.render("profile",{user})
})

app.get("/logout",(req,res)=>{
    res.clearCookie("token")
    res.redirect("/")
})

app.get("/login",isLoggedOut,(req,res)=>{
    res.render("login")
})


app.post("/logins",async (req,res)=>{
    const {email, password} = req.body
    const user = await userModel.findOne({email})
    if(user){
        bcrypt.compare(password,user.password,(err,result)=>{
            if(result){
                const token = jwt.sign({email:user.email,id:user._id},"555")
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

function isLoggedIn(req,res,next){
     const token = req.cookies.token
     if(token){
        const user = jwt.verify(token,"555")
        req.user= user
        next()
     } else {
        res.send("You must be logged in")
     }
}

function isLoggedOut(req,res,next){
     if(!req.cookies.token){
        next()
     } else{
        res.redirect("/profile")
     }
}

app.post("/post",isLoggedIn,async(req,res)=>{
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


app.listen(3000, (req, res) => {
  console.log("Server started at Port 3000");
});
