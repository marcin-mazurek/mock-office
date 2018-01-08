# Mock Office

![travis build status](https://travis-ci.org/xclix/mock-office.svg?branch=master) ![npm version](https://badge.fury.io/js/mock-office.svg) [![Coverage Status](https://coveralls.io/repos/github/xclix/mock-office/badge.svg?branch=master)](https://coveralls.io/github/xclix/mock-office?branch=master)

**Tool for running mock servers locally to faciliate frontend development.**

* Create and run multiple **HTTP** and **Web Socket** servers instantly.
* Cover complex scenarios, including delays, backend error responses, custom headers etc.
* Run it locally or on shared resources, CI.
* Use GUI or REST to manage servers.

## Table of contents:
1. [Installation](#installation)
1. [Usage](#usage)
1. [Introduction](#introduction)
    1. [Behaviours](#behaviours)
    1. [Events](#events)
    1. [Reactions](#reactions)
1. [Adding server](#adding-server)
1. [Adding behaviour](#adding-behaviour)
    1. [Behaviour configuration](#behaviour-options)
    1. [Event configuration](#event-options)
    1. [Reaction configuration](#reaction-options)
1. [Fallback mode](#fallback-mode)
1. [Development](#development)
1. [Test](#test)

## Instalation

Install from npm:
```sh
$ npm run install mock-office -g
```

## Usage

```sh
$ mock-office [--gui]
```

It exposes:
* REST API: `http://localhost:3060`
* GUI: `http://localhost:3070`

## Introduction
Mock Office works like respository of mock servers. Idea was to have one common interface for spawning and managing HTTP and Web Socket servers.

You have two ways to interact with it.
* REST API
* GUI

### Behaviours
Mocks are done by adding behaviours to servers. Behaviour is simply pair of event and reactions. Every type of server has its own accepted event types and reactions.

### Events
When something happens(e.g. incoming request, client connected to server) server generates event objects which are being compared with behaviour event requirements and if match succeeds then reactions trigger.

### Reactions
Reactions are simply server commands e.g. send a http response, start sending web socket messages.

## Adding server

POST `/add-server`

key|type|required|default|value|description|
-|-|-|-|-|-|
name|string|yes|-|any|identify your server|
type|string|yes|-|'http' or 'ws'|server type|
port|number|no|3000|any|listening port|
fallbackUrl|string|no|''|any|if provided it triggers [fallback mode](#fallback-mode)|

## Adding behaviours

POST `/add-behaviour`

key|type|required|default|value|description|
-|-|-|-|-|-|
serverId|string|yes|-|any|the server id to which we want to add the behavior|
behaviour|object|yes|-|any|[behaviour config object](#behaviour-options)|

### Behaviour options

key|type|required|default|value|description|
-|-|-|-|-|-|
event|[event config object](#event-options)|yes|-|any|object describing event which must happen to trigger reactions, see event types and they params for specific servers|
reactions|array of [reaction config object](#reaction-options)|yes|-|any|list of reaction configs|

### Event options

key|type|required|default|value|description|
-|-|-|-|-|-|
type|string|yes|-|any|event type|
params|[ajv schema properties object](https://github.com/epoberezkin/ajv)|no|{}|any| custom params specific to the event type|

### Reaction options

key|type|required|default|value|description|
-|-|-|-|-|-|
type|string|yes|-|any|reaction type|
params|[ajv schema properties object](https://github.com/epoberezkin/ajv)|no|{}|any| custom params specific to the event type|
schedule|[schedule config object](#schedule-options)|no|{}|any|schedule params e.g. delay, interval|

### Schedule options

key|type|required|default|value|description|
-|-|-|-|-|-|
delay|number|no|0|any|reaction delay in ms|
interval|number|no|0|any|interval in ms|

## Fallback mode

Fallback mode let you use your real API while mocking some endpoints not ready yet. This is done by mock server proxying request to fallback API when it can't find behaviour. Nevertheless when in fallback mode you can cover existing endpoints with mocked counterparts.


## Development

To start app development clone repo first and then:

```sh
$ npm i
$ npm run watch # runs webpack dev-server for GUI development
$ npm run serve-app # runs node app
$ npm run serve-app-with-gui # runs node app with GUI events server required for GUI being updated
```

## Test

To run tests:

`$ npm run test`
