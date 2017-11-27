#!/usr/bin/env node

const guiEnabled = (process.argv.indexOf('--gui') > -1);
const chan = require('../index');
const eventsPlugin = require('../lib/app/gui/eventsPlugin').default;

const plugins = [];

if (guiEnabled) {
  chan.startGUI();
  plugins.push(eventsPlugin);
}

chan.startApp(plugins);
