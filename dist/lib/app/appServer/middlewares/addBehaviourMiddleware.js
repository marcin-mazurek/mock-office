'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addBehaviourMiddleware;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _transformers = require('./transformers');

var _ajv = require('../ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var schema = {
  properties: {
    serverId: {
      type: 'string'
    },
    behaviour: {
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
  },
  required: ['serverId', 'behaviour']
};

function addBehaviourMiddleware(req, res) {
  if (!_ajv2.default.validate(schema, req.body)) {
    res.status(400).json({ error: _ajv2.default.errors[0].dataPath + ' ' + _ajv2.default.errors[0].message });
    return;
  }

  try {
    var server = _serversHub2.default.getServer(req.body.serverId);

    if (!server) {
      res.status(400).json({ error: 'Server not found.' });
      return;
    }

    var behaviour = server.webServer.codex.addBehaviour(req.body.behaviour);
    res.status(200).json((0, _transformers.behaviourToResponse)(behaviour));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
//# sourceMappingURL=addBehaviourMiddleware.js.map