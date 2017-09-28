
# Antena Spawn

Spawn a monolithic JavaScript program (no require).

## `child = require("antena/spawn/[node|browser|mock]")(source, argv, receptor)`

* `source : string | object`
  * `path : string`
  * `content : string`
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

## Variables accessible in the child's scope

* `global : object`
* `__filename : string`
* `__dirname : string`
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
