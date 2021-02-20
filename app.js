// Setup stuff
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const hashtag = require(__dirname + '/public/js/hashtag.js');

const upload = multer({
    storage: multer.memoryStorage()
});

const app = express();

app.set('view engine', 'ejs');
const port = 80;

app.use(express.static('instagram-hashtag-classifier'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Sends the webpage
app.get("/", function(req, res) {
    console.log("User requested webpage");
    res.render("index");
});

app.post('/imageHastags', upload.single('uploadFile'), (req, res) => {
    console.log(uploadFile);
});

// Turns on the server
app.listen(port, function(){
    console.log("Server has started running on port: " + port);
});