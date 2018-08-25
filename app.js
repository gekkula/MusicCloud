/**
 * Created by kishoregekkula on 24/08/18.
 */

var express = require("express");
var bodyParser = require("body-parser");
var routes = require("./routes/routes.js");
var app = express();

 app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json({limit: '50mb'}));

app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "https://musiccloud.herokuapp.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static('./client/'));
app.use(express.static("./uploads/cover-image/"+ '/data/img'));
//app.use(express.static("./uploads/cover-image/"+ '/data/img'));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

routes(app);

var server = app.listen(process.env.PORT || 3030, function () {
    console.log("app running on port.", server.address().port);
});