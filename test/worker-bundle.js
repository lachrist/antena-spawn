
var Fs = require("fs");
var Path = require("path");
var Browserify = require("browserify");

var source = {path:Path.join(__dirname, "child.js")};
source.content = Fs.readFileSync(source.path, "utf8");
Browserify(Path.join(__dirname, "worker.js")).bundle(function (error, bundle) {
  if (error)
    throw error;
  Fs.writeFileSync(Path.join(__dirname, "worker.html"), [
    "<!DOCTYPE html>",
    "<html>",
    "  <head>",
    "    <script>",
    "var SOURCE = "+JSON.stringify(source)+";",
    bundle.toString("utf8"),
    "    </script>",
    "  </head>",
    "  <body>",
    "  </body>",
    "</html>"
  ].join("\n"), {encoding:"utf8"});
});
