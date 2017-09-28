
var Fs = require("fs");
var Path = require("path");
var Spawn = require("../node");
var Chalk = require("chalk");

var child = Spawn(Fs.readFileSync(Path.join(__dirname, "child.js"), "utf8"), ["foo", "bar"], require("./receptor.js"));

child.stdin.write("stdin test\n");

child.stdout.on("data", function (data) {
  process.stdout.write(Chalk.green(data));
});

child.stderr.on("data", function (data) {
  process.stderr.write(Chalk.red(data));
});
