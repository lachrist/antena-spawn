
## antena-spawn/worker

```sh
browserify worker.js > worker-bundle.js
```

## antena-spawn/node

```sh
node node.js 
[ 'node', 'inline', 'foo', 'bar' ]

[ null,
  200,
  'ok',
  { connection: 'keep-alive', 'transfer-encoding': 'chunked' },
  'pong' ]

stdin test

null 400 'no-handler'
Error: No handler
    at /Users/soft/Desktop/workspace/antena-spawn/node_modules/antena/receptor/factory.js:15:26
    at module.exports (/Users/soft/Desktop/workspace/antena-spawn/demo/parent.js:2:18)
    at Object.<anonymous> (/Users/soft/Desktop/workspace/antena-spawn/demo/node.js:7:1)
    at Module._compile (module.js:624:30)
    at Object.Module._extensions..js (module.js:635:10)
    at Module.load (module.js:545:32)
    at tryModuleLoad (module.js:508:12)
    at Function.Module._load (module.js:500:3)
    at Function.Module.runMain (module.js:665:10)
    at startup (bootstrap_node.js:201:16)

Hello , world!
```

## antena-spawn/mock

```sh
node mock.js
[ 'mock', 'inline', 'foo', 'bar' ]

Error: Mock emitters cannot handle synchronous HTTP requests because it would involve transforming asynchronous calls into synchronous calls. This is made difficult/impossible on purpose since doing so would break the run-to-completion semantic. There is a node module called deasync which tries to circumvent this limitation but it does not support nested calls (cf: https://github.com/abbr/deasync/issues/83).
    at Object.request (/Users/soft/Desktop/workspace/antena-spawn/node_modules/antena/emitter/mock.js:13:11)
    at eval (eval at <anonymous> (/Users/soft/Desktop/workspace/antena-spawn/mock/index.js:49:18), <anonymous>:8:27)
    at Timeout._onTimeout (/Users/soft/Desktop/workspace/antena-spawn/mock/index.js:51:9)
    at ontimeout (timers.js:469:11)
    at tryOnTimeout (timers.js:304:5)
    at Timer.listOnTimeout (timers.js:264:5)
stdin test

```
