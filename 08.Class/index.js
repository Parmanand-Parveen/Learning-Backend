const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.set("view engine","ejs")
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,"public")))

app.get("/", function (req, res) {
    fs.readdir("./files",function(err,file){
       res.render("index",{file:file})
    })

})
app.post("/create", function (req, res) {
   fs.writeFile(`./files/${req.body.title.split(" ").join("")}.txt`,req.body.details,function(err){
     res.redirect("/")
   })
})

app.get("/files/:filename",function(req,res){
    fs.readFile(`./files/${req.params.filename}`,"utf-8", function(err,data){
        res.render("show",{title:req.params.filename, details:data})
    })
})


app.get("/files/:filename/delete",function(req,res){
    fs.unlink(`./files/${req.params.filename}`,function(err){
        res.redirect("/")
    })
})
app.listen(3000)