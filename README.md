
# antena-spawn

Spawn scripts with an antena connection.

## `child = require("antena/spawn/[node|browser|mock]")(script, argv, receptor)`

* `script : string`
* `argv : [string]`
* `receptor : antena.Receptor`
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
    * `argv : [string]`
    * `emitter : antena.Emitter`
    * `stdin : stream.Readable`
    * `stdout : stream.Writable`
    * `stderr : stream.Writable`
    * `exit(code)`
      * `code : number`
    * `send(message)`
      * `message : json`
    * Event `message`
      * `message : json`
