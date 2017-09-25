
var Stream = require("stream");

function noop () {}

exports.Readable = function (con) {
  con.on("message", function (message) {
    if (typeof message === "string")
      return readable.push(message, "utf8");
    readable.push(Buffer.from(message));
  });
  var readable = new Stream.Readable({read:noop});
  return readable;
};

exports.Writable = function (con) {
  return new Stream.Writable({
    decodeStrings: false,
    write: function (chunk, encoding, callback) {
      if (Buffer.isBuffer(chunk))
        chunk = chunk.buffer;
      else if (encoding !== "utf8")
        chunk = Buffer.from(chunk, encoding).buffer;
      con.send(chunk);
      callback();
    }
  });
};
