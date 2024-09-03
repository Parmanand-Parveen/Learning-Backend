const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

 TODO
//  Complete all the stuff

app.listen(3000, function(err) {
    if (err) {
        console.error("Error starting server:", err);
    } else {
        console.log('Server started on http://localhost:3000');
    }
});