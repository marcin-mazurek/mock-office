#!/usr/bin/env node
'use strict';

var guiEnabled = process.argv.indexOf('--gui') > -1;
var mockOffice = require('../index');

var plugins = [];

if (guiEnabled) {
  mockOffice.startGUI();
}

mockOffice.startApp(plugins);
//# sourceMappingURL=mock-office.js.map