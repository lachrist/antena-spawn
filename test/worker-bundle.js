
var Fs = require("fs");
var Path = require("path");
var Browserify = require("browserify");

Browserify(Path.join(__dirname, "worker.js")).bundle(function (error, bundle) {
  if (error)
    throw error;
  Fs.writeFileSync(Path.join(__dirname, "worker.html"), [
    "<!DOCTYPE html>",
    "<html>",
    "  <head>",
    "    <script>",
    "var SCRIPT = "+JSON.stringify(Fs.readFileSync(Path.join(__dirname, "child.js"), "utf8"))+";",
    bundle.toString("utf8"),
    "    </script>",
    "  </head>",
    "  <body>",
    "  </body>",
    "</html>"
  ].join("\n"), {encoding:"utf8"});
});
