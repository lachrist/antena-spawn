
var Events = require("events");
var Receptor = require("antena/receptor");
var Attach = require("antena/receptor/attach-worker.js");
var Terminate = require("../util/terminate.js");
var WebsocketBuffer = require("../util/websocket-buffer.js");
var StreamWebsocket = require("../util/stream-websocket.js");
var IpcWebsocket = require("../util/ipc-websocket.js");

module.exports = function (source, argv, receptor) {
  var child = new Events();
  var cons = {io:WebsocketBuffer(), err:WebsocketBuffer(), ipc:WebsocketBuffer()};
  IpcWebsocket(cons.ipc, child);
  child.stdin = StreamWebsocket.Writable(cons.io);
  child.stdout = StreamWebsocket.Readable(cons.io);
  child.stderr = StreamWebsocket.Readable(cons.err);
  child.stdio = [child.stdin, child.stdout, child.stderr];
  var worker = new Worker(TEMPLATE_CHILD_URL);
  var close = Attach(Receptor({}).merge({
    user: receptor,
    antena: Receptor({
      onrequest: function (method, path, headers, body, callback) {
        if (path === "/begin")
          return callback(200, "ok", {}, JSON.stringify({
            source: typeof source === "string" ? {path:source} : source, 
            argv: argv || []
          }));
        if (path === "/end")
          return terminate(parseInt(body), null);
        callback(400, "invalid-path", {}, "");
      },
      onconnect: function (path, con) { cons[path.substring(1)].flush(con) }
    })
  }), worker);
  worker.onerror = function (error) {
    child.stderr.push(error.message+"\n");
  };
  function terminate (code, signal) {
    close();
    Terminate(child, code, signal);
  }
  child.kill = function (signal) { terminate(null, signal) };
  return child;
};
