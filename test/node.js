
var Path = require("path");
var Spawn = require("../node");
var Chalk = require("chalk");

var child = Spawn(Path.join(__dirname, "child.js"), ["foo", "bar"], require("./receptor.js"));

child.stdin.write("stdin test\n");

child.stdout.on("data", function (data) {
  process.stdout.write(Chalk.green(data));
});

child.stderr.on("data", function (data) {
  process.stderr.write(Chalk.red(data));
});
