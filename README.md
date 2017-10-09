
# antena-spawn

Spawn inline scripts with an antena connection.
Usage [here](/demo), live demo [here](https://cdn.rawgit.com/lachrist/antena-spawn/9fe0f5eb/demo/worker.html).

## `spawn = require("antena/spawn/[node|browser|mock]")(receptor)`

* `receptor : antena.Receptor`
* `child = spawn(script, argv)`
  * `script : string`
  * `argv : [string]`
  * `child : events.EventEmitter`
    * `stdin : stream.Writable`
    * `stdout : stream.Readable`
    * `stderr : stream.Readable`
    * `send(message)`
      * `message : json`
    * Event `message`
      * `message : json`
    * `kill(signal)`
      * `signal : string`
    * Event `exit`
      * `code : number`
      * `signal : string`
    * Event `close`
      * `code : number`
      * `signal : string`
    * Event `error`
      * `error : Error`

## Shimed variables accessible in the child's scope

* `global : object`
* `console : console.Console`
* `process : events.EventEmitter`
    * `emitter : antena.Emitter`
    * `argv : [string]`
    * `stdin : stream.Readable`
    * `stdout : stream.Writable`
    * `stderr : stream.Writable`
    * `exit(code)`
      * `code : number`
    * `send(message)`
      * `message : json`
    * Event `message`
      * `message : json`
