'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = importMiddleware;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _transformers = require('./transformers');

var _ajv = require('../ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      behaviours: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            event: {
              type: 'object',
              properties: {
                type: {
                  type: 'string'
                }
              },
              required: ['type']
            },
            reactions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  type: {
                    type: 'string'
                  }
                },
                required: ['type']
              }
            }
          },
          required: ['reactions', 'event']
        }
      }
    }
  }
};

function importMiddleware(req, res) {
  if (!_ajv2.default.validate(schema, req.body)) {
    res.status(400).json({ error: _ajv2.default.errors[0].dataPath + ' ' + _ajv2.default.errors[0].message });
    return;
  }

  _serversHub2.default.import(req.body).then(function () {
    res.json(_serversHub2.default.getServers().map(_transformers.serverToResponse));
  });
}
//# sourceMappingURL=importMiddleware.js.map