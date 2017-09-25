
var Events = require("events");
var EmitterWorker = require("antena/emitter/worker");
var Console = require("../util/console.js");
var StreamWebsocket = require("../util/stream-websocket.js");
var IpcWebsocket = require("../util/ipc-websocket.js");

var emitters = EmitterWorker().split(["antena", "user"]);
var mock = new Events();
mock.emitter = emitters.user;
mock.exit = function (code) { emitters.antena.request("GET", "/end", {}, String(code)) }
global.process = mock;
var counter = 0;

(function (con) {
  counter++;
  con.on("open", function () {
    mock.stdin = StreamWebsocket.Readable(con);
    mock.stdout = StreamWebsocket.Writable(con);
    global.console = Console(mock.stdout);
    ready();
  });
} (emitters.antena.connect("/io")));

(function (con) {
  counter++;
  con.on("open", function () {
    mock.stderr = StreamWebsocket.Writable(con);
    ready();
  });
} (emitters.antena.connect("/err")));

(function (con) {
  counter++;
  con.on("open", function () {
    IpcWebsocket(con, mock);
    ready();
  });
} (emitters.antena.connect("/ipc")));

function ready () {
  if (!--counter) {
    emitters.antena.request("GET", "/begin", {}, "", function (error, status, reason, header, body) {
      if (error || status !== 200)
        throw error || new Error(status+" "+reason);
      var data = JSON.parse(body);
      mock.argv = ["browser", data.source.path].concat(data.argv);
      if (data.source.content)
        return global.eval(data.source.content);
      var req = new XMLHttpRequest();
      req.open("GET", data.source.path);
      req.onload = function () {
        if (req.status !== 200)
          throw new Error("Cannot load "+source+": "+req.status+" "+req.statusText);
        global.eval(req.responseText);
      };
      req.send();
    });
  }
}
