#!/usr/bin/env node

/* eslint no-console:off */
"use strict";
console.log(process.argv);
const guiEnabled = (process.argv.indexOf("--gui") > -1);
const chan = require('../index');

chan.startApp();

if (guiEnabled) {
  chan.startGUI();
}
