var Fs = require("fs");
var Path = require("path");
var Spawn = require("../mock");
var Receptor = require("antena/receptor");
var Parent = require("./parent.js");
var script = Fs.readFileSync(Path.join(__dirname, "child.js"), "utf8");
Parent(Spawn, Receptor, script);