var express = require("express");
var firebase = require("firebase/app");

var router = express.Router();

var config = {
  apiKey: "AIzaSyCAVHyAObAk9kKAAuYeU4a4aggCUVQ6UHs",
  authDomain: "reena-webhooks.firebaseapp.com",
  databaseURL: "https://reena-webhooks.firebaseio.com",
  projectId: "reena-webhooks",
  storageBucket: "reena-webhooks.appspot.com",
  messagingSenderId: "608226426951",
};
firebase.initializeApp(config);

router.delete("/notifications/:id", function (req, res) {
  console.log("delete Request");
  var ref = firebase
    .database()
    .ref("/reena-webhooks/WH-07116015G24478845-3DR475354G855374P");
  ref
    .remove()
    .then(function () {
      console.log("Remove succeeded.");
    })
    .catch(function (error) {
      console.log("Remove failed: " + error.message);
    });
});

router.get("/notifications/:username", function (req, res) {
  console.log("HTTP Get Request");
  var ref = firebase.database().ref("/reena-webhooks");
  var arr = [];
  ref
    .orderByChild("username")
    .equalTo(req.params.username)
    .on(
      "value",
      function (snapshot) {
        snapshot.forEach((child) => {
          arr.push(child.val());
        });
        var finalArr = arr.slice().sort(function (a, b) {
          return (new Date(a.create_time) - new Date(b.create_time)) * -1;
        });

        res.json(finalArr);
        ref.off("value");
      },
      function (errorObject) {
        console.log("The read failed: " + errorObject.code);
        res.send("The read failed: " + errorObject.code);
      }
    );
});

router.get("/notifications", function (req, res) {
  console.log("HTTP Get Request");
  var webhookRef = firebase.database().ref("/reena-webhooks");
  var arr = [];
  //Attach an asynchronous callback to read the data
  webhookRef.orderByChild("create_time").on(
    "value",
    function (snapshot) {
      snapshot.forEach((child) => {
        arr.push(child.val());
      });
      var finalArr = arr.slice().sort(function (a, b) {
        return (new Date(a.create_time) - new Date(b.create_time)) * -1;
      });

      res.json(finalArr);
      webhookRef.off("value");
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      res.send("The read failed: " + errorObject.code);
    }
  );
});

router.post("/:username", function (req, res, next) {
  console.log("incoming webhook at " + new Date());
  console.log(req.headers);
  console.log(req.body);
  var body = req.body;
  body.username = req.params.username;
  body.web_date = new Date();

  if (body) firebase.database().ref("/reena-webhooks").child(body.id).set(body);
  console.log("stored ");

  res.end();
});

module.exports = router;
