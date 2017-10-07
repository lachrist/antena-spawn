var Spawn = require("../worker");
var Receptor = require("antena/receptor/worker");
var Parent = require("./parent.js");
var req = new XMLHttpRequest();
req.open("GET", "child.js");
req.addEventListener("load", function () {
  Parent(Spawn, Receptor, req.responseText);
});
req.send();