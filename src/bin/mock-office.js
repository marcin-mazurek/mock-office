#!/usr/bin/env node

const guiEnabled = (process.argv.indexOf('--gui') > -1);
const mockOffice = require('../index');

const plugins = [];

if (guiEnabled) {
  mockOffice.startGUI();
}

mockOffice.startApp(plugins);
