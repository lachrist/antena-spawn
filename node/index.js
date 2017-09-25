
var Http = require("http");
var Path = require("path");
var ChildProcess = require("child_process");
var Attach = require("antena/receptor/attach-server.js");

module.exports = function (source, argv, receptor) {
  var port = (process.platform.indexOf("win") === 0) ? 0 : "/tmp/antena-spawn-node-"+Math.random().toString(36).substring(2)+".sock";
  var server = Http.createServer();
  Attach(receptor, server);
  server.listen(port, function () {
    child.send({
      source: typeof source === "string" ? {path:source} : source,
      argv: argv || [],
      port: port || server.address().port
    });
  });
  var child = ChildProcess.fork(Path.join(__dirname, "child.js"), [], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });
  child.on("close", function () { server.close() });
  return child;
};
