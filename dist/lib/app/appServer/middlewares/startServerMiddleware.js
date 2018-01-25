'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = startServerMiddleware;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _ajv = require('../ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function startServerMiddleware(req, res) {
  var schema = {
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  };

  if (_ajv2.default.validate(schema, req.body)) {
    _serversHub2.default.getServer(req.body.id).webServer.start().then(function () {
      res.status(200).json({ id: req.body.id });
    }, function (err) {
      res.status(500).json({ error: err });
    });
  } else {
    res.status(400).json({ error: _ajv2.default.errors[0].message });
  }
}
//# sourceMappingURL=startServerMiddleware.js.map