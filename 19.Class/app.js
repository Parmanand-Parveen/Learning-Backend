const express = require("express");
const app =  express();
const path = require("path");
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






app.listen(3000, () => {
    console.log("Server is running on port 3000");
})