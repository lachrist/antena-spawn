
var Events = require("events");
var EmitterWorker = require("antena/emitter/worker");
var Console = require("../util/console.js");
var StreamWebsocket = require("../util/stream-websocket.js");

var emitter = EmitterWorker();
var mock = new Events();
mock.emitter = emitter.fork("meta");
mock.exit = function (code) { emitter.request("GET", "/end", {}, String(code)) }
var counter = 0;

(function (con) {
  counter++;
  mock.stdin = StreamWebsocket.Readable(con);
  mock.stdout = StreamWebsocket.Writable(con);
  con.on("open", onopen);
} (emitter.connect("/io")));

(function (con) {
  counter++;
  mock.stderr = StreamWebsocket.Writable(con);
  con.on("open", onopen);
} (emitter.connect("/err")));

(function (con) {
  counter++;
  con.on("message", function (message) { mock.emit("message", JSON.parse(message)) });
  emitter.send = function (json) { con.send(JSON.stringify(json)) };
  con.on("open", onopen);
} (emitter.connect("/ipc")));

function onopen () {
  if (!--counter) {
    emitter.request("GET", "/begin", {}, "", function (error, status, reason, header, body) {
      if (error || status !== 200)
        throw error || new Error(status+" "+reason);
      var data = JSON.parse(body);
      mock.argv = data.argv;
      var main = Function("global", "process", "console", data.script);
      main(global, mock, Console(mock.stdout, mock.stderr));
    });
  }
}
