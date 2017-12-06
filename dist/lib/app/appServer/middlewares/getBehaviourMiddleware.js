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
  properties: {
    server: {
      type: 'string'
    },
    scenario: {
      type: 'string'
    },
    id: {
      type: 'string'
    }
  },
  required: ['server', 'scenario', 'id']
};

function configure(ajv) {
  return function (req, res) {
    if (!ajv.validate(schema, req.query)) {
      res.status(400).json(ajv.errors);
      return;
    }

    try {
      var server = _serversHub2.default.getServer(req.query.server);

      if (!server) {
        res.status(404).end();
        return;
      }

      var behaviour = server.webServer.codex.getBehaviour(req.query.id);
      if (!behaviour) {
        res.status(404).end();
        return;
      }

      res.status(200).json((0, _transformers.behaviourToResponse)(behaviour));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
}
//# sourceMappingURL=getBehaviourMiddleware.js.map