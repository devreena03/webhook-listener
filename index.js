var express = require("express");

var app = express.Router();
app.get("/", function (req, res) {
  // res.sendFile(__basedir + "/public/index.html");
  res.sendFile(__basedir + "/public/webhooks.html");
});

app.get("/webhook", function (req, res) {
  res.sendFile(__basedir + "/public/webhooks.html");
});

module.exports = app;
