
// mkdir node_modules
// cd node_modules/
// ln -s ../../../commonjs-playground/ commonjs-playground
// ln -s ../../../stdio-gui/ stdio-gui

var Fs = require("fs");
var Path = require("path");
var Browserify = require("browserify");
var CommonjsPlayground = require("commonjs-playground");

function cst (x) {
  return function () {
    return x;
  };
}

CommonjsPlayground(Path.join(__dirname, "receptor.js"), function (error, rplayground) {
  if (error)
    throw error;
  CommonjsPlayground(Path.join(__dirname, "child.js"), function (error, cplayground) {
    if (error)
      throw error;
    Fs.writeFileSync(Path.join(__dirname, "playgrounds.js"), "module.exports = "+JSON.stringify({
      receptor: rplayground,
      child: cplayground
    }, null, 2)+";\n", {encoding:"utf8"});
    Browserify(Path.join(__dirname, "script.js")).bundle(function (error, bundle) {
      if (error)
        throw error;
      var script = "<script>"+bundle.toString("utf8").replace("</script>", "<\\/script>")+"</script>";
      var html = Fs.readFileSync(Path.join(__dirname, "template.html"), "utf8").replace("<!-- SCRIPT -->", cst(script));
      Fs.writeFileSync(Path.join(__dirname, "index.html"), html, {encoding:"utf8"});
    });
  })
});
