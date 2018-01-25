'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = editServerMiddleware;

var _ramda = require('ramda');

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _transformers = require('./transformers');

var _ajv = require('../ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function editServerMiddleware(req, res) {
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
      recordMode: {
        type: 'boolean'
      },
      id: {
        type: 'string'
      }
    },
    required: ['id']
  };

  if (!_ajv2.default.validate(schema, req.body)) {
    var splitPath = _ajv2.default.errors[0].dataPath.split('.');
    var param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: param + ' ' + _ajv2.default.errors[0].message });
    return;
  }

  var _req$body = req.body,
      id = _req$body.id,
      name = _req$body.name,
      port = _req$body.port,
      recordMode = _req$body.recordMode,
      fallbackUrl = _req$body.fallbackUrl;

  var server = _serversHub2.default.getServer(id);
  if (!server) {
    res.status(404).end();
    return;
  }

  if (name) {
    server.name = name;
  }

  if (fallbackUrl) {
    server.webServer.fallbackUrl = fallbackUrl;
  }

  if (typeof recordMode !== 'undefined') {
    server.webServer.triggerRecordMode(recordMode);
  }

  if (port) {
    server.webServer.changePort(port).then(function () {
      res.status(200).json((0, _ramda.omit)(['behaviours'], (0, _transformers.serverToResponse)(server)));
    });
  } else {
    res.status(200).json((0, _ramda.omit)(['behaviours'], (0, _transformers.serverToResponse)(server)));
  }
}
//# sourceMappingURL=editServerMiddleware.js.map