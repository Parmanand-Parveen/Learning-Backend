const express = require('express');
const app = express()
const fs = require('node:fs')





app.get("/", function(req,res){
    res.send("Hello bhaiyao kaise ho aap")
})

app.listen(3000) 

