'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.configureGuiEventsServer = configureGuiEventsServer;
exports.serveGuiEventsServer = serveGuiEventsServer;
exports.createGuiServer = createGuiServer;
exports.serveGuiServer = serveGuiServer;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _ws = require('ws');

var _eventLog = require('../eventLog');

var _serversHub = require('../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GUI_EVENTS_SERVER_PORT = 3061;

function configureGuiEventsServer() {
  var httpServer = _http2.default.createServer();
  var server = new _ws.Server({ server: httpServer });
  var sockets = [];

  function broadcast(event, args) {
    sockets.forEach(function (socket) {
      return socket.send(JSON.stringify(Object.assign({ event: event }, args)));
    });
  }

  server.on('connection', function (ws) {
    sockets.push(ws);

    ws.on('close', function () {
      sockets = sockets.filter(function (socket) {
        return socket !== ws;
      });
    });
  });
  (0, _eventLog.on)('behaviour-status-change', function (args) {
    return broadcast('behaviour-status-change', args);
  });
  (0, _eventLog.on)('reaction-status-change', function (args) {
    return broadcast('reaction-status-change', args);
  });

  return {
    server: httpServer,
    broadcast: broadcast
  };
}

function serveGuiEventsServer(server, port) {
  server.listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(_safe2.default.green('GUI events address: ws://127.0.0.1:' + port));
  });
}

function createGuiServer() {
  var staticAssetsMiddleware = function staticAssetsMiddleware(req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../../gui/' + req.originalUrl));
  };
  var reactAppMiddleware = function reactAppMiddleware(req, res) {
    res.sendFile(_path2.default.resolve(__dirname, '../../gui/index.html'));
  };
  var app = (0, _express2.default)();
  app.use('/static/*', staticAssetsMiddleware);
  app.use('*', reactAppMiddleware);
  return app;
}

function serveGuiServer(port) {
  createGuiServer().listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(_safe2.default.green('GUI address: http://127.0.0.1:' + port));
  });
  var guiEventsServer = configureGuiEventsServer(_serversHub2.default);
  serveGuiEventsServer(guiEventsServer.server, GUI_EVENTS_SERVER_PORT);
}
//# sourceMappingURL=index.js.map