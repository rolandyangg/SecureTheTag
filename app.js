// Setup stuff
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

const port = 80;

// Sends the webpage
app.get("/", function(req, res) {
    res.render("index");
});

// Turns on the server
app.listen(port, function(){
    console.log("Server has started running on port: " + port);
});