
var Events = require("events");
var Stream = require("stream");
var EmitterMock = require("antena/emitter/mock.js");
var Console = require("console");
var Terminate = require("../util/terminate.js");

function run (script, mock) {
  var main = Function("process", "console", script);
  try {
    main(mock, new Console(mock.stdout, mock.stderr));
  } catch (error) {
    mock.stderr.write(error && "stack" in error ? error.stack : ""+error+"\n");
  }
}

// decodeStrings is set to false to avoid an
// decoding/encoding pass in the below case:
// readable.setEncoding("utf8");
// writable.write("foo", "utf8");
function noop () {}
function pair () {
  var readable = new Stream.Readable({
    destroy: function (error, callback) { writable.destroy(error, callback) },
    read:noop
  });
  var writable = new Stream.Writable({
    decodeStrings: false,
    destroy: function (error, callback) { readable.destroy(error, callback) },
    write: function (chunk, encoding, callback) {
      readable.push(chunk, encoding);
      callback();
    }
  });
  return {readable:readable, writable:writable};
}

module.exports = function (load) {
  return function (source, argv, receptor) {
    var child = new Events();
    var mock = new Events();
    (function (stdin) {
      child.stdin = stdin.writable;
      mock.stdin = stdin.readable;
    } (pair()));
    (function (stdout) {
      child.stdout = stdout.readable;
      mock.stdout = stdout.writable;
    } (pair()));
    (function (stderr) {
      child.stderr = stderr.readable;
      mock.stderr = stderr.writable;
    } (pair()));
    child.send = function (message) { mock.emit("message", JSON.parse(JSON.stringify(message))) };
    mock.send = function (message) { child.emit("message", JSON.parse(JSON.stringify(message))) };
    child.kill = function (signal) { Terminate(child, null, signal) };
    mock.exit = function (code) { Terminate(child, code, null) };
    child.stdio = [child.stdin, child.stdout, child.stderr];
    mock.emitter = EmitterMock(receptor);
    source = typeof source === "string" ? {path:source} : source;
    mock.argv = ["mock", source.path||null].concat(argv||[]);
    if (source.content) {
      setTimeout(0, run, source.content, mock);
    } else {
      load(source.path, function (error, content) {
        if (error)
          return child.emit("error", error);
        run(content, mock);
      });
    }
    return child;
  };
};
