
var Http = require("http");
var Path = require("path");
var ChildProcess = require("child_process");

module.exports = function (receptor) {
  return function (script, argv) {
    var port = "/tmp/antena-spawn-node-"+Math.random().toString(36).substring(2)+".sock";
    if (process.platform.indexOf("win") === 0)
      port = 0;
    var server = Http.createServer();
    receptor.attach(server);
    var child = ChildProcess.fork(Path.join(__dirname, "child.js"), [], {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
    });
    child.on("close", function () { server.close() });
    server.listen(port, function () {
      child.send({
        script: script,
        argv: ["node", "inline"].concat(argv||[]),
        port: port || server.address().port
      });
    });
    return child;
  };
};
