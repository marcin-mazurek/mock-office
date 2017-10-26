#!/usr/bin/env node

const guiEnabled = (process.argv.indexOf('--gui') > -1);
const chan = require('../index');

let guiServerMiddleware;

if (guiEnabled) {
  guiServerMiddleware = chan.startGUI();
}

chan.startApp(guiServerMiddleware);
