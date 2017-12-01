#!/usr/bin/env node

const guiEnabled = (process.argv.indexOf('--gui') > -1);
const chan = require('../index');

const plugins = [];

if (guiEnabled) {
  chan.startGUI();
}

chan.startApp(plugins);
