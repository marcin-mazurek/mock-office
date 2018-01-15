'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuid = require('cuid');

var _cuid2 = _interopRequireDefault(_cuid);

var _HttpWebServer = require('./webServers/http/HttpWebServer');

var _HttpWebServer2 = _interopRequireDefault(_HttpWebServer);

var _WsWebServer = require('./webServers/ws/WsWebServer');

var _WsWebServer2 = _interopRequireDefault(_WsWebServer);

var _eventLog = require('./eventLog');

var _eventLog2 = _interopRequireDefault(_eventLog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var serverTypes = {
  http: _HttpWebServer2.default,
  ws: _WsWebServer2.default
};

var ServersHub = function () {
  function ServersHub() {
    _classCallCheck(this, ServersHub);

    this.servers = [];
    this.add = this.add.bind(this);
    this.getServer = this.getServer.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.rename = this.rename.bind(this);
  }

  _createClass(ServersHub, [{
    key: 'add',
    value: function add(cfg) {
      var WebServerConstructor = serverTypes[cfg.type];
      var id = (0, _cuid2.default)();
      var webServer = new WebServerConstructor(id, cfg, _eventLog2.default);
      var server = {
        id: id,
        name: cfg.name,
        type: cfg.type,
        webServer: webServer
      };
      this.servers.push(server);
      return server;
    }
  }, {
    key: 'getServer',
    value: function getServer(id) {
      return this.servers.find(function (server) {
        return server.id === id;
      });
    }
  }, {
    key: 'getAll',
    value: function getAll() {
      return [].concat(this.servers);
    }
  }, {
    key: 'remove',
    value: function remove(id) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        var index = _this.servers.findIndex(function (server) {
          return server.id === id;
        });

        if (index < 0) {
          reject(false);
        }

        resolve(index);
      }).then(function (index) {
        var server = _this.servers[index];

        return server.webServer.stop().then(function () {
          _this.servers.splice(index, 1);
          return true;
        });
      });
    }
  }, {
    key: 'rename',
    value: function rename(id, name) {
      var server = this.getServer(id);

      if (server) {
        server.rename(name);
        return Promise.resolve();
      }

      return Promise.reject();
    }
  }, {
    key: 'getServers',
    value: function getServers() {
      return this.servers;
    }
  }, {
    key: 'setState',
    value: function setState(state) {
      var _this2 = this;

      state.forEach(function (s) {
        var server = _this2.add(s);
        s.behaviours.forEach(function (behaviour) {
          server.webServer.codex.addBehaviour(behaviour);
        });
      });
    }
  }, {
    key: 'import',
    value: function _import(state) {
      var _this3 = this;

      var serversStoppingPromises = [];

      this.servers.forEach(function (server) {
        if (server.webServer.isLive()) {
          serversStoppingPromises.push(server.webServer.stop());
        }
      });

      return Promise.all(serversStoppingPromises).then(function () {
        _this3.servers.length = 0;
        _this3.setState(state);
      });
    }
  }]);

  return ServersHub;
}();

exports.default = new ServersHub();
//# sourceMappingURL=serversHub.js.map