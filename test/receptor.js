
var Receptor = require("antena/receptor");

module.exports = Receptor({}).merge({
  "ping": Receptor({
    onrequest: function (method, path, headers, body, callback) {
      callback(200, "ok", {}, "pong");
    }
  }),
  "hello": Receptor({
    onconnect: function (path, con) {
      con.on("message", function (message) { console.log(message) });
      con.send("Hello ");
    }
  })
});
