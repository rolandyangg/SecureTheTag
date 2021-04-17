// Setup stuff
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const {
    getHashtagsFromWord
} = require("./public/js/hashtag");
const hashtag = require(__dirname + '/public/js/hashtag.js');

const upload = multer({
    storage: multer.memoryStorage()
});

const app = express();

app.set('view engine', 'ejs');
const port = process.env.PORT || 80;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

// Sends the webpage
app.get("/", function (req, res) {
    console.log("User requested webpage");
    res.render("index");
});

app.post('/getImageHashtags', upload.array('myFiles[]'), (req, res) => {
    (async () => {
        var data = await hashtag.getHashtagsFromImage(req.files[0].buffer);
        res.send(JSON.stringify(data)); // Sends the results
        console.log("Results sent to page!");
    })()
});

app.post('/getKeywordHashtags', upload.single("Keyword"), (req, res) => {
    console.log("Keyword passed in: " + req.body.Keyword);
    (async () => {
        var data = await getHashtagsFromWord(req.body.Keyword);
        res.send(JSON.stringify(data)); // Sends the results
        console.log("Results sent to page!");
    })()
});

// Turns on the server
app.listen(port, function () {
    console.log("Server has started running on port: " + port);
});
