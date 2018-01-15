'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _rxjs = require('rxjs');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _httpProxy = require('http-proxy');

var _httpProxy2 = _interopRequireDefault(_httpProxy);

var _HttpServerCodex = require('./HttpServerCodex');

var _HttpServerCodex2 = _interopRequireDefault(_HttpServerCodex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HttpWebServer = function () {
  function HttpWebServer(id, config) {
    var _this = this;

    _classCallCheck(this, HttpWebServer);

    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.start = this.start.bind(this);
    this.saveSocketRef = this.saveSocketRef.bind(this);
    this.destroyOpenSockets = this.destroyOpenSockets.bind(this);
    this.stop = this.stop.bind(this);
    this.isLive = this.isLive.bind(this);
    this.changePort = this.changePort.bind(this);
    this.id = id;
    this.sockets = [];
    this.port = config.port || 3000;
    this.secure = config.secure;
    this.keyPath = config.keyPath;
    this.certPath = config.certPath;
    this.pendingBehaviours = [];
    this.codex = new _HttpServerCodex2.default(this.id);
    this.fallbackUrl = config.fallbackUrl || '';
    this.recordMode = false;
    var httpServer = this.secure ? _https2.default : _http2.default;
    this.proxy = _httpProxy2.default.createProxyServer();

    var app = (0, _express2.default)();
    app.use(_bodyParser2.default.json());

    var event = void 0;
    var reaction = void 0;

    // record
    this.proxy.on('proxyReq', function (proxyReq, clientReq) {
      if (_this.recordMode) {
        event = {
          type: 'request',
          params: {
            path: {
              type: 'string',
              enum: [clientReq.url]
            },
            method: {
              type: 'string',
              enum: [clientReq.method]
            }
          }
        };
      }
    });

    this.proxy.on('proxyRes', function (proxyRes) {
      if (_this.recordMode) {
        reaction = {
          type: 'response',
          params: {
            status: proxyRes.statusCode
          }
        };

        var body = '';

        proxyRes.on('data', function (chunk) {
          body += chunk;
        });
        proxyRes.on('end', function () {
          reaction.params.payload = body;
          _this.codex.addBehaviour({
            event: event,
            reactions: [reaction],
            loadedCounter: 1000
          });
        });
      }
    });

    var middlewares = [function (req, res, next) {
      _this.handler({ req: req, res: res, next: next });
    }, function (req, res, next) {
      if (_this.fallbackUrl) {
        // add url property to request to path be visible to servers other than node http
        // eslint-disable-next-line no-param-reassign
        req.url = req.originalUrl;
        _this.proxy.web(req, res, { target: _this.fallbackUrl });
      } else {
        next();
      }
    }];

    app.use('*', middlewares);

    this.request$ = _rxjs.Observable.fromEventPattern(function (handler) {
      _this.handler = handler;
    }).do(function (_ref) {
      var req = _ref.req,
          res = _ref.res,
          next = _ref.next;

      var behaviour = _this.codex.matchBehaviour(HttpWebServer.requestToEvent(req));

      if (behaviour) {
        behaviour.configureReceiver(req, res).execute();
        _this.pendingBehaviours.push(behaviour);
      } else {
        next();
      }
    });

    if (this.secure) {
      var credentials = {
        key: _fs2.default.readFileSync(this.keyPath),
        cert: _fs2.default.readFileSync(this.certPath)
      };

      this.httpServer = httpServer.createServer(credentials, app);
    } else {
      this.httpServer = httpServer.createServer(app);
    }

    // we need store sockets to destroy them manually before closing server
    this.httpServer.on('connection', this.saveSocketRef);
  }

  // requestToEvent :: http.ClientRequest -> Object


  _createClass(HttpWebServer, [{
    key: 'start',


    // start :: void -> Promise
    value: function start() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.requestsSub = _this2.request$.subscribe();
        _this2.httpServer.listen(_this2.port, resolve);
        _this2.httpServer.on('error', function (err) {
          if (err.code === 'EADDRINUSE') {
            reject('Port ' + err.port + ' is in use. Choose different port.');
          }
        });
      });
    }

    // triggerRecordMode :: Boolean -> void

  }, {
    key: 'triggerRecordMode',
    value: function triggerRecordMode(shouldRecord) {
      this.recordMode = shouldRecord;
    }

    // saveSocketRef :: Socket -> void

  }, {
    key: 'saveSocketRef',
    value: function saveSocketRef(socket) {
      this.sockets.push(socket);
    }

    // destroyOpenSockets :: void -> void

  }, {
    key: 'destroyOpenSockets',
    value: function destroyOpenSockets() {
      this.sockets.forEach(function (socket) {
        return socket.destroy();
      });
      this.sockets.length = 0;
    }

    // clearPendingReactions :: void -> void

  }, {
    key: 'clearPendingReactions',
    value: function clearPendingReactions() {
      this.pendingBehaviours.forEach(function (pB) {
        return pB.cancel();
      });
      this.pendingBehaviours.length = 0;
    }

    // stop :: void -> Promise

  }, {
    key: 'stop',
    value: function stop() {
      var _this3 = this;

      return new Promise(function (resolve) {
        if (_this3.requestsSub) {
          _this3.requestsSub.unsubscribe();
          _this3.requestsSub = null;
        }

        // Browsers can keep connection open, thus callback after
        // HttpBehaviourServer.stop cant be called if there are sockets
        // still open, so we need to ensure that all sockets are
        // destroyed
        // https://nodejs.org/api/net.html#net_server_close_callback
        _this3.destroyOpenSockets();
        _this3.httpServer.close(resolve);
      });
    }

    // void -> Boolean

  }, {
    key: 'isLive',
    value: function isLive() {
      return this.httpServer.listening;
    }

    // changePort :: String -> Promise

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
  }], [{
    key: 'requestToEvent',
    value: function requestToEvent(req) {
      return {
        type: 'request',
        params: {
          path: req.originalUrl,
          method: req.method,
          headers: req.headers
        }
      };
    }
  }]);

  return HttpWebServer;
}();

exports.default = HttpWebServer;
//# sourceMappingURL=HttpWebServer.js.map