# Mock server

#### Tool for running mock servers locally to faciliate frontend development.

* You can create and run multiple http and web socket servers in a second.
* You can cover complex scenarios, including delays, backend error responses, custom headers etc.
* You can run it locally or on shared resources, CI.
* You can use GUI or REST to manage servers.

Command your mock server to behave as you want by adding interactions:

**Interactions consists of action and commands**

* action(what happened): request from client, new connection etc.
* reactions(what should do): send a response or emit message, disconnect etc.

Currently multiple reactions for one action is usable ony for web socket servers for multiple messages, but we got way to implement more types of actions in the future.

## Usage
For now it only can be run from node CLI or npm script.

At first you need to install dependencies with npm.

*`$ npm i`*

#### To start app:

*`$ npm run build`*

*`$ npm run start`*

Local app will be listening on `http://127.0.0.1:3060`

#### For enabling GUI

*`$ npm run start-with-gui`*

GUI is served at `http://127.0.0.1:3070`

## Development
To start app development:

*`$ npm run watch`*

*`npm run pm2-run-with-gui`*

## Test
To run tests:

*`$ npm run test`*
