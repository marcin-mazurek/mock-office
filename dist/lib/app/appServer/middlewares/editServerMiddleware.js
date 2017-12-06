'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(ajv) {
  var createResponseBody = function createResponseBody(server) {
    return {
      name: server.name,
      port: server.webServer.port,
      type: server.type,
      secure: server.webServer.secure,
      id: server.id,
      running: server.webServer.isLive()
    };
  };

  return function (req, res) {
    var schema = {
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        port: {
          type: 'number',
          minimum: 3000
        },
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (!ajv.validate(schema, req.body)) {
      var splitPath = ajv.errors[0].dataPath.split('.');
      var param = splitPath[splitPath.length - 1];
      res.status(400).json({ error: param + ' ' + ajv.errors[0].message });
      return;
    }

    var _req$body = req.body,
        id = _req$body.id,
        name = _req$body.name,
        port = _req$body.port;

    var server = _serversHub2.default.getServer(id);
    if (!server) {
      res.status(404).end();
      return;
    }
    if (name) {
      server.name = name;
    }

    if (port) {
      server.webServer.changePort(port).then(function () {
        res.status(200).json(createResponseBody(server));
      });
    } else {
      res.status(200).json(createResponseBody(server));
    }
  };
}
//# sourceMappingURL=editServerMiddleware.js.map