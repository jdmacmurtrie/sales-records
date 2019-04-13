const express = require("express");
const router = express.Router();
const fs = require("fs");
var app = express();

const csv = require("csv-parser");

fs.createReadStream(__dirname + "/Data.csv")
  .pipe(csv())
  .on("data", function(data) {
    try {
      //perform the operation
    } catch (err) {
      //error handler
    }
  })
  .on("end", function() {
    //some final operation
  });

// router.use("/api", require("./api"));
// var data = require("../data/Data.csv");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get("/data", (req, res, next) => {
  console.log("gettin ghere??");
  // res.send(data);
});

module.exports = router;
