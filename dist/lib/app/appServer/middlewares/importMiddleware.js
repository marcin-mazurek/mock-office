'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _transformers = require('./transformers');

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

function configure(ajv) {
  return function (req, res) {
    if (!ajv.validate(schema, req.body)) {
      res.status(400).json({ error: ajv.errors[0].dataPath + ' ' + ajv.errors[0].message });
      return;
    }

    _serversHub2.default.import(req.body).then(function () {
      res.json(_serversHub2.default.getServers().map(_transformers.serverToResponse));
    });
  };
}
//# sourceMappingURL=importMiddleware.js.map