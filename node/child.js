
var EmitterNode = require("antena/emitter/node.js");

process.on("message", function (message) {
  process.removeAllListeners("messsage");
  process.emitter = EmitterNode(message.port, false);
  process.argv = ["node", message.source.path].concat(message.argv);
  global.eval(message.script);
});
