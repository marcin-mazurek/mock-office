'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(ajv) {
  return function (req, res) {
    var schema = {
      properties: {
        behaviourId: {
          type: 'string'
        },
        serverId: {
          type: 'string'
        }
      },
      required: ['behaviourId', 'serverId']
    };

    if (!ajv.validate(schema, req.body)) {
      res.json(ajv.errors);
      return;
    }

    var server = _serversHub2.default.getServer(req.body.serverId);

    if (!server) {
      res.status(400).end();
      return;
    }

    if (server.webServer.codex.removeBehaviour(req.body.behaviourId)) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  };
}
//# sourceMappingURL=removeBehaviourMiddleware.js.map