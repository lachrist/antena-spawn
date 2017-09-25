
var Events = require("events");

function close (code, reason) { this._inner.close(code, reason) }

function send (message) { this._inner.send(message) }

function flush (con) {
  this._inner.forEach(function (message) { con.send(message )});
  this._inner = con;
  this.close = close;
  delete this.flush;
  var self = this;
  con.on("message", function (message) { self.emit("message", message) });
  con.on("close", function (code, reason) { self.emit("close", code, reason) });
}

module.exports = function () {
  var wrapper = new Events();
  wrapper.send = send;
  wrapper._inner = [];
  wrapper._inner.send = Array.prototype.push;
  wrapper.flush = flush;
  return wrapper;
};
