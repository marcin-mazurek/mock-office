'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exportMiddleware;

var _serversHub = require('../../serversHub');

var _serversHub2 = _interopRequireDefault(_serversHub);

var _transformers = require('./transformers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function exportMiddleware(req, res) {
  res.set({
    'Content-Type': 'text/plain',
    'Content-Disposition': 'attachment; filename=export.json'
  }).write(JSON.stringify(_serversHub2.default.getServers().map(_transformers.serverToResponse)), 'utf-8', function () {
    res.end();
  });
}
//# sourceMappingURL=exportMiddleware.js.map