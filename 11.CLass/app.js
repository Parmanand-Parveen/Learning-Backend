const express = require("express");
const app = express();
const User = require("./user.model");

app.get("/", function (req, res) {
    res.send("Hello World");
});

app.get("/create",  async(req, res)=> {
   const user = await User.create({ name: "Parmanand", age: 26 });
    res.send(user);
});
app.get("/read",async(req,res)=>{
    const users = await User.findOne({"name":"Parmanand"});
    res.send(users)
})
app.get("/update",async(req,res)=>{
    const user = await User.findOneAndUpdate({name:"sachin"},{age:27});
    res.send(user)
})

app.get("/delete",async(req,res)=>{
    const user = await User.findOneAndDelete({name:"sachin"});
    res.send(user)
})
app.listen(3000)