'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ws = require('ws');

var _rxjs = require('rxjs');

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _WsServerCodex = require('./WsServerCodex');

var _WsServerCodex2 = _interopRequireDefault(_WsServerCodex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WsWebServer = function () {
  function WsWebServer(id, config, eventBus) {
    var _this = this;

    _classCallCheck(this, WsWebServer);

    this.id = id;
    if (eventBus) {
      this.eventBus = eventBus;
    }
    this.port = config.port || 3000;
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changePort = this.changePort.bind(this);
    this.pendingBehaviours = [];
    this.codex = new _WsServerCodex2.default(this.id);

    var httpServer = this.secure ? _https2.default : _http2.default;

    if (this.secure) {
      var options = {
        key: _fs2.default.readFileSync(this.keyPath),
        cert: _fs2.default.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(options);
    } else {
      this.httpServer = httpServer.createServer();
    }

    this.wsServer = new _ws.Server({ server: this.httpServer });
    this.wsServer.on('error', function (err) {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.connections$ = _rxjs.Observable.fromEventPattern(function (handler) {
      _this.wsServer.on('connection', handler);
    })
    // support only one client
    .filter(function () {
      return !_this.ws;
    }).do(function (ws) {
      _this.ws = ws;
      _this.messages$ = _rxjs.Observable.fromEventPattern(function (handler) {
        ws.on('message', handler);
      }).map(function (message) {
        return {
          type: 'message',
          params: {
            message: message
          }
        };
      }).map(function (event) {
        return _this.codex.matchBehaviour(event);
      }).filter(function (behaviour) {
        return !!behaviour;
      }).do(function (behaviour) {
        behaviour.configureReceiver(_this.ws).execute();
      });
      _this.messagesSub = _this.messages$.subscribe();

      _this.clientDisconnect$ = _rxjs.Observable.fromEventPattern(function (handler) {
        _this.ws.on('close', handler);
      }).take(1).do(function () {
        _this.clearPendingReactions();
        _this.ws = null;
        _this.connectionSub = _this.connections$.subscribe();
      });

      _this.clientDisconnectSub = _this.clientDisconnect$.subscribe();
    }).mapTo({
      type: 'connection'
    }).map(function (event) {
      return {
        behaviour: _this.codex.matchBehaviour(event)
      };
    }).filter(function (_ref) {
      var behaviour = _ref.behaviour;
      return !!behaviour;
    }).do(function (_ref2) {
      var behaviour = _ref2.behaviour;

      behaviour.configureReceiver(_this.ws).execute();
      _this.pendingBehaviours.push(behaviour);
    });
  }

  _createClass(WsWebServer, [{
    key: 'clearPendingReactions',
    value: function clearPendingReactions() {
      this.pendingBehaviours.forEach(function (pB) {
        return pB.cancel();
      });
      this.pendingBehaviours.length = 0;
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      if (this.isLive()) {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        _this2.connectionSub = _this2.connections$.subscribe();
        _this2.httpServer.listen(_this2.port, resolve);
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      if (!this.isLive()) {
        return Promise.resolve();
      }

      return new Promise(function (resolve) {
        if (_this3.ws) {
          _this3.ws.terminate();
        }

        _this3.httpServer.close(resolve);
      });
    }
  }, {
    key: 'isLive',
    value: function isLive() {
      return this.httpServer.listening;
    }
  }, {
    key: 'changePort',
    value: function changePort(port) {
      var _this4 = this;

      if (this.isLive()) {
        return this.stop().then(function () {
          _this4.port = port;
        }).then(function () {
          _this4.start();
        });
      }

      this.port = port;
      return Promise.resolve();
    }
  }]);

  return WsWebServer;
}();

exports.default = WsWebServer;
//# sourceMappingURL=WsWebServer.js.map