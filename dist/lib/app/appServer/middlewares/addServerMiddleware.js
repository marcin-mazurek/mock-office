'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _transformers = require('./transformers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(ajv) {
  return function (req, res) {
    var schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          minLength: 1
        },
        port: {
          type: 'number',
          minimum: 3000
        },
        type: {
          type: 'string',
          enum: ['http', 'ws']
        },
        secure: {
          type: 'boolean'
        },
        keyPath: {
          type: 'string'
        },
        certPath: {
          type: 'string'
        }
      },
      required: ['name', 'type']
    };

    if (ajv.validate(schema, req.body)) {
      var server = _serversHub2.default.add(req.body);

      res.json((0, _transformers.serverToResponse)(server));

      return;
    }

    var splitPath = ajv.errors[0].dataPath.split('.');
    var param = splitPath[splitPath.length - 1];
    res.status(400).json({ error: param + ' ' + [0].message });
  };
}
//# sourceMappingURL=addServerMiddleware.js.map