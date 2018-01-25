'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = removeServerMiddleware;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _ajv = require('../ajv');

var _ajv2 = _interopRequireDefault(_ajv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function removeServerMiddleware(req, res) {
  var schema = {
    type: 'object',
    properties: {
      id: {
        type: 'string'
      }
    },
    required: ['id']
  };

  if (_ajv2.default.validate(schema, req.body)) {
    _serversHub2.default.remove(req.body.id).then(function () {
      res.status(200).end();
    }, function () {
      res.status(404).end();
    });
  } else {
    res.status(400).json(_ajv2.default.errors[0]);
  }
}
//# sourceMappingURL=removeServerMiddleware.js.map