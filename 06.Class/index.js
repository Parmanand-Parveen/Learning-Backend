const express = require('express');
const path = require('path')
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')));//SEETTING UP THE STATIC FILE PATH AS PUBLIC BUT PATH KO REQUIRE KARNA JAROORI HAI
app.set('view engine','ejs')   //HERE WE ARE SETTING UP THE VIEW ENGINE AS EJS


app.get("/", function(req,res){
    res.render("index")//HERE WE ARE RENDREING THE VIEWS 
})


// +++++++++++++++++++++++++++++++++++++++++++++++++++PROFILE START HERE++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get("/profile/:username",function(req,res){//YAHA USERNAME SE PEHLE : LAGATE HI YHE USERNAME DYNAMIC HO JATA HAI 
   const username= req.params.username //REQ PARAMS SE HAM US URL KE DYNAMIC PART KO USE KAR SAKTE HAI
    res.send(`hii i am ${username}`)
})

app.get("/profile/:username/:age",function(req,res){
    const age= req.params.age
    const username = req.params.username
     res.send(`My name is ${username.toUpperCase()} and my age is ${age}`)
 })

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++PROFILE END HERE++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.listen(3000) 

