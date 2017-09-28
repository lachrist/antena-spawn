
module.exports = function (con, emitter) {
  con.on("message", function (message) { emitter.emit("message", JSON.parse(message)) });
  emitter.send = function (json) { con.send(JSON.stringify(json)) };
};
