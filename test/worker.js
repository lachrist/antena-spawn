
var Path = require("path");
var Spawn = require("../worker");

var child = Spawn(SCRIPT, ["foo", "bar"], require("./receptor.js"));

child.stdin.write("stdin test\n");

child.stdout.on("data", function (data) {
  console.log("%c "+data, "color:green");
});

child.stderr.on("data", function (data) {
  console.log("%c "+data, "color:red");
});
