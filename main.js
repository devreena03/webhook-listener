var express = require("express");
var bodyParser = require("body-parser");
var index = require("./index");
var webhook = require("./webhook");

var app = express();

global.__basedir = __dirname;

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(express.static(__dirname + "/public"));

app.use("/", index);
app.use("/webhook", webhook);

var port = process.env.PORT || "5070";
app.listen(port, function () {
  console.log("server started at port " + port);
});
