
# Antena Spawn

`child = require("antena/spawn/node")(source, argv, receptor)`
`child = require("antena/spawn/browser")(source, argv, receptor)`
`child = require("antena/spawn/mock")(source, argv, receptor)`

* `source : object | string`
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

* `global : object`
  * `__dirname : string`
  * `__filename : string`
  * `argv : [string]`
  * `process : events.EventEmitter`
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

