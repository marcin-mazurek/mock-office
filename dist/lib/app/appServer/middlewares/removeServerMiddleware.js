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
      type: 'object',
      properties: {
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (ajv.validate(schema, req.body)) {
      _serversHub2.default.remove(req.body.id).then(function () {
        res.status(200).end();
      }, function (err) {
        console.log(err);
        res.status(404).end();
      });
    } else {
      res.status(400).json(ajv.errors);
    }
  };
}
//# sourceMappingURL=removeServerMiddleware.js.map