var express = require("express");
const router = require("express").Router();
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get("/data", (req, res, next) => {
  console.log("gettin ghere??");
  res.send(data);
});

module.exports = router;
