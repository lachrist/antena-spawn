module.exports = function (Spawn, Receptor, script) {
  var receptor = Receptor({}).merge({
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
  var spawn = Spawn(receptor);
  var child = spawn(script, ["foo", "bar"]);
  child.stdin.write("stdin test\n");
  child.stdout.on("data", function (data) {
    console.log(data.toString());
  });
  child.stderr.on("data", function (data) {
    console.error(data.toString());
  });
};