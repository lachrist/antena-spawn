
var Events = require("events");
var EmitterWorker = require("antena/emitter/worker");
var Console = require("console");
var Path = require("path");
var StreamWebsocket = require("../util/stream-websocket.js");
var IpcWebsocket = require("../util/ipc-websocket.js");

var emitter = EmitterWorker();
var mock = new Events();
mock.emitter = emitter.fork("meta");
mock.exit = function (code) { emitter.request("GET", "/end", {}, String(code)) }
var counter = 0;

(function (con) {
  counter++;
  con.on("open", function () {
    mock.stdin = StreamWebsocket.Readable(con);
    mock.stdout = StreamWebsocket.Writable(con);
    global.console = Console(mock.stdout, mock.stderr);
    ready();
  });
} (emitter.connect("/io")));

(function (con) {
  counter++;
  con.on("open", function () {
    mock.stderr = StreamWebsocket.Writable(con);
    ready();
  });
} (emitter.connect("/err")));

(function (con) {
  counter++;
  con.on("open", function () {
    IpcWebsocket(con, mock);
    ready();
  });
} (emitter.connect("/ipc")));

function run (path, content) {
  var main = Function("global", "__filename", "__dirname", "process", "console", content);
  main(global, path, Path.basename(path), mock, new Console(mock.stdout, mock.stderr));
}

function ready () {
  if (!--counter) {
    emitter.request("GET", "/begin", {}, "", function (error, status, reason, header, body) {
      if (error || status !== 200)
        throw error || new Error(status+" "+reason);
      var data = JSON.parse(body);
      mock.argv = ["browser", data.source.path].concat(data.argv);
      if (data.source.content)
        return run (data.source.path, data.source.content);
      var req = new XMLHttpRequest();
      req.open("GET", data.source.path);
      req.onload = function () {
        if (req.status !== 200)
          throw new Error("Cannot load "+source+": "+req.status+" "+req.statusText);
        run(data.source.path, req.responseText);
      };
      req.send();
    });
  }
}
