'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startGUI = exports.startApp = undefined;

var _appServer = require('./lib/app/appServer');

var _guiServer = require('./lib/app/guiServer');

var _eventLog = require('./lib/app/eventLog');

var APP_SERVER_PORT = 3060;
var GUI_SERVER_PORT = 3070;

var startApp = exports.startApp = function startApp(plugins) {
  plugins.forEach(function (p) {
    return p.start(_eventLog.on);
  });
  (0, _appServer.serveAppServer)(APP_SERVER_PORT);
};

var startGUI = exports.startGUI = function startGUI() {
  (0, _guiServer.serveGuiServer)(GUI_SERVER_PORT);
};
//# sourceMappingURL=index.js.map