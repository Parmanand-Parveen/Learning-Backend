const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    fs.readdir("./files",function(err,folderfiles){
        // YAHA PE FOLDERFILES WOH SAARE FILE KA AARAY HAI JOH KI files folder me hai 
        res.render('index',{files: folderfiles});
    //   OR JOH YHE PEHLA WALA FILE HAI WOH BASS EK VARIABLE NAME HAI JIS NAAM SE HAM FILE KO INDEX PAGE PE BEJ RAHE HAI
        
    })
});

app.post('/create',function(req,res){
   fs.writeFile(`./files/${req.body.title.split(' ').join('')}.txt`,req.body.details,function(err, data){
    res.redirect('/')
   })
})



app.listen(3000, function(err) {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log('Server started on http://localhost:3000');
    }
});