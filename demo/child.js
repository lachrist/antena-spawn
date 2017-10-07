process.stdin.on("data", function (data) {
  process.stderr.write(data);
});
var emitters = process.emitter.split(["ping", "unmatched", "hello"]);
console.log(process.argv);
console.log(emitters.ping.request("GET", "/", {}, ""));
emitters.unmatched.request("GET", "/", {}, "", function (error, status, reason, headers, body) {
  console.log(error, status, reason);
  console.log(body);
});
var con = emitters.hello.connect("/");
con.on("message", function (message) { con.send(message+", world!") });
setTimeout(function () {
  process.exit(0);
}, 1000);