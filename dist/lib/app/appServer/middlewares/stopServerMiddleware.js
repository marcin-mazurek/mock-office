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
        id: {
          type: 'string'
        }
      },
      required: ['id']
    };

    if (ajv.validate(schema, req.body)) {
      _serversHub2.default.getServer(req.body.id).webServer.stop().then(function () {
        res.status(200).json({ id: req.body.id });
      }, function (err) {
        res.status(400).json({ error: err.message });
      });
    } else {
      res.status(400).json({ error: ajv.errors[0].message });
    }
  };
}
//# sourceMappingURL=stopServerMiddleware.js.map