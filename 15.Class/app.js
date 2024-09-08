const express = require("express");
const app = express();
const path = require("path");
const User = require("./models/user.models");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  res.render("index");
});

app.post("/create", async (req, res) => {

    const { name, age, email, password, image } = req.body;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      const users = new User({
        name,
        age,
        email,
        password: hash,
        image,
      });
      users.save();
    });
    res.redirect("/");
  
});

app.get("/login", async (req, res) => {
  res.render("login");
}); 

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        const token =jwt.sign({email:user.email},"shhhh")
        res.cookie("token",token)
        res.render("profile",{user:user});
      } else{
        res.send("Somthing went wrong")
      }
    });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
});


app.listen(3000, function (err) {
  if (err) throw err;
  console.log("server is running");
});
