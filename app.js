var path = require('path');
var express = require('express');
var cors = require('cors');
var app = express();
var base64 = require('file-base64');
var base64Img = require('base64-img');
app.use(cors());
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded());

app.use(bodyParser.json());

var htmlPath = path.join(__dirname, 'html');
var fs = require('fs');
app.use(express.static(htmlPath));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
var host = "";
var port = "";



const handleError = (err, res) => {
    res
        .status(500)
        .contentType("text/plain")
        .end("Oops! Something went wrong!");
};

app.post('/getFile', function (req, res) {
    filePath = req.body.data;
    base64Img.base64(filePath.replace("file://", ""), function (err, data) {
        // console.log(data);
        var responseData = {
            "data": data
        };
        res.send(responseData);
    })


})


app.post('/saveFile', function (req, res) {

    var img = req.body.data;
    var data = img.replace(/^data:image\/\w+;base64,/, "");
    var buf = Buffer.from(data, 'base64');
    var fileIndex = 1;
    fs.readdir('./html/uploads', (err, files) => {
        console.log(files.length);
        fileIndex = files.length + 1;
        var fileName = './html/uploads/image' + fileIndex + '.png';

        fs.writeFile(fileName, buf, function (err, result) {
            if (err) console.log('error', err);
        });
        var responseData = {
            "Source": "http://" + host + ":" + port + "/uploads/image" + fileIndex + ".png"
        }
        res.send(responseData);


    });
})





var server = app.listen(3000, function () {
    host = 'localhost';
    port = server.address().port;
    console.log('listening on http://' + host + ':' + port + '/');
});

