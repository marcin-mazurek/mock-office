# Mock Office

![travis build status](https://travis-ci.org/xclix/mock-office.svg?branch=master) ![npm version](https://badge.fury.io/js/mock-office.svg) [![Coverage Status](https://coveralls.io/repos/github/xclix/mock-office/badge.svg?branch=master)](https://coveralls.io/github/xclix/mock-office?branch=master)

**Tool for running mock servers locally to faciliate frontend development.**

* Create and run multiple **HTTP** and **Web Socket** servers instantly.
* Cover complex scenarios, including delays, backend error responses, custom headers etc.
* Run it locally or on shared resources, CI.
* Use GUI or REST to manage servers.

## Table of contents:
1. [Introduction](#introduction)
1. [Installation](#installation)
1. [Usage](#usage)
1. [Adding server](#adding-server)
1. [Adding behaviour](#adding-behaviour)
    1. [Behaviour config object](#behaviour-config-object)
    1. [Event config object](#event-config-object)
    1. [Reaction config object](#reaction-config-object)
1. [Fallback mode](#fallback-mode)
1. [Development](#development)
1. [Test](#test)

## Introduction
Mock Office works like respository of mock servers. Idea was to have one common interface for spawning and managing HTTP and Web Socket servers.

You have two ways to interact with it.
* REST API
* GUI

## Instalation
---
Install from npm:
```sh
$ npm run install mock-office -g
```

## Usage
---
```sh
$ mock-office [--gui]
```

It exposes:
* REST API: `http://localhost:3060`
* GUI: `http://localhost:3070`

## Adding server
---
POST `/add-server`

key|type|required|default|value|description|
-|-|-|-|-|-|
name|string|yes|-|any|identify your server
type|string|yes|-|'http' or 'ws'|server type
port|number|no|3000|any|listening port
fallbackUrl|string|no|''|any|if provided it triggers [fallback mode](#fallback-mode)

## Adding behaviours
---
POST `/add-behaviour`

key|type|required|default|value|description|
-|-|-|-|-|-|
serverId|string|yes|-|any|the server id to which we want to add the behavior
behaviour|object|yes|-|any|[behaviour config object](#behaviour-config-object)

Behaviour options<span id="behaviour-config-object"></span>
key|type|required|default|value|description|
-|-|-|-|-|-|
event|[event config object](#event-config-object)|yes|-|any|event config
reactions|array of [reaction config object](#reaction-config-object)|yes|-|any|list of reaction configs

Event options<span id="event-config-object"></span>
key|type|required|default|value|description|
-|-|-|-|-|-|
type|string|yes|-|any|event type
params|[ajv schema object](https://github.com/epoberezkin/ajv)|no|{}|any| custom params specific to the event type

Reaction options<span id="reaction-config-object"></span>
key|type|required|default|value|description|
-|-|-|-|-|-|
type|string|yes|-|any|reaction type
params|[ajv schema object](https://github.com/epoberezkin/ajv)|no|{}|any| custom params specific to the event type
schedule|[schedule config object](#schedule-config-object)|no|{}|any|schedule params e.g. delay, interval

Schedule options<span id="schedule-config-object"></span>
key|type|required|default|value|description|
-|-|-|-|-|-|
delay|number|no|0|any|reaction delay in ms
interval|number|no|0|any|interval in ms

## Fallback mode
---
Fallback mode let you use your real API while mocking some endpoints not ready yet. This is done by mock server proxying request to fallback API when it can't find behaviour. Nevertheless when in fallback mode you can cover existing endpoints with mocked counterparts.


## Development
---
To start app development clone repo first and then:

`$ npm i`

`$ npm run watch` runs webpack dev-server for GUI development

`$ npm run serve-app` runs node app

`$ npm run serve-app-with-gui` runs node app with GUI events server required for GUI being updated

## Test
---
To run tests:

`$ npm run test`
