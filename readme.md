# Mock Office

#### Tool for running mock servers locally to faciliate frontend development.

* You can create and run multiple http and web socket servers in a second.
* You can cover complex scenarios, including delays, backend error responses, custom headers etc.
* You can run it locally or on shared resources, CI.
* You can use GUI or REST to manage servers.

Command your mock server to behave as you want by adding behaviours.

Match events by schemas using wide known [AJV schema validator](https://github.com/epoberezkin/ajv)!

Control reactions schedules using delays, intervals etc.

Use your real backend sevice as fallback for your mock server to provide working endpoints when you can focus on adding new ones.

**Behaviour consists of event and reactions**

* event(what happened): request from client, new connection etc.
* reactions(what should do): send a response or emit message, disconnect etc.

Currently multiple reactions for one action is usable ony for web socket servers for multiple messages, but we got way to implement more types of reactions for http server in the future.

## Usage
For now it only can be run from node CLI or npm script.

At first you need to install dependencies with npm.

*`$ npm i`*

*`$ npm run build`*

*`$ npm run start`*

Local app will be listening on `http://127.0.0.1:3060`

## Adding behaviours

Simple payload required for adding behaviour

```
{
  "event": {
    "type": "event type",
    "params": {} // here use ajv objects https://github.com/epoberezkin/ajv
  },
  "reactions": [
    {
      "type": "reaction type",
      "params": {} // configuration object specific for reaction,
      "schedule": {
        "delay": 1000 // deffered execution
        "interval": 1000 // time based exection
      }
    }
  ]
}
```

## Http server

Event types:

* `request` - on incoming request

| Params  | Type   | Description                                            |
|---------|--------|--------------------------------------------------------|
| status  | String | HTTP status                                            |
| method  | String | HTTP method                                            |
| path    | String | request path                                           |
| headers | Object | plain object with props { headerName: headerValue }  |


Reaction types:

* `reponse` - send response to request

### Fallback mode

Add fallback url to proxy requests when mock server can't find behaviour.

## Web socket server

Event types:

* `connection` - when ws client is connecting to server


* `message` - on message from client

| Params  | Type   | Description         |
|---------|--------|---------------------|
| message | String | message from client |

Reaction types:

* `message` - send message to client

## GUI

*`$ npm run start-with-gui`*

GUI is served at `http://127.0.0.1:3070`

## Development
To start app development:

*`$ npm run watch`*

*`npm run pm2-run-with-gui`*

## Test
To run tests:

*`$ npm run test`*
