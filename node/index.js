
var Http = require("http");
var Path = require("path");
var ChildProcess = require("child_process");
var Attach = require("antena/receptor/attach-server.js");

module.exports = function (script, argv, receptor) {
  var port = (process.platform.indexOf("win") === 0) ? 0 : "/tmp/antena-spawn-node-"+Math.random().toString(36).substring(2)+".sock";
  var server = Http.createServer();
  Attach(receptor, server);
  server.listen(port, function () {
    child.send({
      script: script,
      argv: argv || ["node", "inline"],
      port: port || server.address().port
    });
  });
  var child = ChildProcess.fork(Path.join(__dirname, "child.js"), [], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
  });
  child.on("close", function () { server.close() });
  return child;
};
