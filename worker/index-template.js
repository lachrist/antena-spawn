
var Events = require("events");
var Receptor = require("antena/receptor/worker");
var Terminate = require("../util/terminate.js");
var WebsocketBuffer = require("../util/websocket-buffer.js");
var StreamWebsocket = require("../util/stream-websocket.js");

module.exports = function (receptor) {
  return function (script, argv) {
    var child = new Events();
    var cons = {io:WebsocketBuffer(), err:WebsocketBuffer(), ipc:WebsocketBuffer()};
    cons.ipc.on("message", function (message) { child.emit("message", JSON.parse(message)) });
    child.send = function (json) { cons.ipc.send(JSON.stringify(json)) };
    child.stdin = StreamWebsocket.Writable(cons.io);
    child.stdout = StreamWebsocket.Readable(cons.io);
    child.stderr = StreamWebsocket.Readable(cons.err);
    child.stdio = [child.stdin, child.stdout, child.stderr];
    var worker = Receptor({
      onrequest: function (method, path, headers, body, callback) {
        if (path === "/begin")
          return callback(200, "ok", {}, JSON.stringify({
            script: script,
            argv: argv || []
          }));
        if (path === "/end")
          return terminate(parseInt(body), null);
        callback(400, "invalid-path", {}, "");
      },
      onconnect: function (path, con) {
        if (path === "/io" || path === "/err" || path === "ipc")
          return cons[path.substring(1)].flush(con);
        con.close(4000, "invalid-path");
      }
    }).merge({meta:receptor}).spawn(TEMPLATE_CHILD_URL);
    worker.addEventListener("error", function (error) {
      child.stderr.push(error.message+" at "+error.filename+", line "+error.lineno+", column "+error.colno+"\n");
    });
    function terminate (code, signal) {
      close();
      Terminate(child, code, signal);
    }
    child.kill = function (signal) { terminate(null, signal) };
    return child;
  };
};
