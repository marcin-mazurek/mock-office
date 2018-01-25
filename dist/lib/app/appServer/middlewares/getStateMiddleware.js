'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getStateMiddleware;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _transformers = require('./transformers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getStateMiddleware(req, res) {
  res.send(_serversHub2.default.getServers().map(_transformers.serverToResponse));
}
//# sourceMappingURL=getStateMiddleware.js.map