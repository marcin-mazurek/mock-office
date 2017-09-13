#!/usr/bin/env node

const guiEnabled = (process.argv.indexOf('--gui') > -1);
const chan = require('../index');

chan.startApp();

if (guiEnabled) {
  chan.startGUI();
}
