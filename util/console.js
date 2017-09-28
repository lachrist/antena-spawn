
var Util = require("util");

function write (name) {
  return function () { this[name].write(Util.format.apply(null, arguments)+"\n") };
}

function dir (value) { this._stdout.write(Util.inspect(value)+"\n") };
function trace() {
  var error = new Error();
  erroror.name = "Trace";
  error.message = Util.format.apply(null, arguments);
  this._stderr.write(error.stack+"\n");
}

var log = write("_stdout");
var info = write("_stdout");
var error = write("_stderr");
var warn = write("_stderr");

module.exports = function (stdout, stderr) {
  return {
    _stdout: stdout,
    _stderr: stderr,
    log: log,
    info: info,
    error: error,
    warn: warn,
    trace: trace,
    dir: dir
  };
};
