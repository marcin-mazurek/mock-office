'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serveAppServer = exports.createAppServer = undefined;

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _safe = require('colors/safe');

var _safe2 = _interopRequireDefault(_safe);

var _addServerMiddleware = require('./middlewares/addServerMiddleware');

var _addServerMiddleware2 = _interopRequireDefault(_addServerMiddleware);

var _removeServerMiddleware = require('./middlewares/removeServerMiddleware');

var _removeServerMiddleware2 = _interopRequireDefault(_removeServerMiddleware);

var _startServerMiddleware = require('./middlewares/startServerMiddleware');

var _startServerMiddleware2 = _interopRequireDefault(_startServerMiddleware);

var _stopServerMiddleware = require('./middlewares/stopServerMiddleware');

var _stopServerMiddleware2 = _interopRequireDefault(_stopServerMiddleware);

var _editServerMiddleware = require('./middlewares/editServerMiddleware');

var _editServerMiddleware2 = _interopRequireDefault(_editServerMiddleware);

var _addBehaviourMiddleware = require('./middlewares/addBehaviourMiddleware');

var _addBehaviourMiddleware2 = _interopRequireDefault(_addBehaviourMiddleware);

var _removeBehaviourMiddleware = require('./middlewares/removeBehaviourMiddleware');

var _removeBehaviourMiddleware2 = _interopRequireDefault(_removeBehaviourMiddleware);

var _exportMiddleware = require('./middlewares/exportMiddleware');

var _exportMiddleware2 = _interopRequireDefault(_exportMiddleware);

var _getBehaviourMiddleware = require('./middlewares/getBehaviourMiddleware');

var _getBehaviourMiddleware2 = _interopRequireDefault(_getBehaviourMiddleware);

var _configurePersistentState = require('./configurePersistentState');

var _configurePersistentState2 = _interopRequireDefault(_configurePersistentState);

var _getStateMiddleware = require('./middlewares/getStateMiddleware');

var _getStateMiddleware2 = _interopRequireDefault(_getStateMiddleware);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var persistentState = (0, _configurePersistentState2.default)();
persistentState.restore();

var createAppServer = exports.createAppServer = function createAppServer() {
  var ajv = new _ajv2.default();
  var app = (0, _express2.default)();
  app.use((0, _cors2.default)());

  app.post('/add-server', _bodyParser2.default.json(), (0, _addServerMiddleware2.default)(ajv));
  app.post('/remove-server', _bodyParser2.default.json(), (0, _removeServerMiddleware2.default)(ajv));
  app.post('/start-server', _bodyParser2.default.json(), (0, _startServerMiddleware2.default)(ajv));
  app.post('/stop-server', _bodyParser2.default.json(), (0, _stopServerMiddleware2.default)(ajv));
  app.post('/edit-server', _bodyParser2.default.json(), (0, _editServerMiddleware2.default)(ajv));
  app.post('/add-behaviour', _bodyParser2.default.json(), (0, _addBehaviourMiddleware2.default)(ajv));
  app.post('/remove-behaviour', _bodyParser2.default.json(), (0, _removeBehaviourMiddleware2.default)(ajv));
  app.get('/export', (0, _exportMiddleware2.default)());
  app.get('/behaviour', (0, _getBehaviourMiddleware2.default)(ajv));
  app.get('/state', (0, _getStateMiddleware2.default)());

  return app;
};

var serveAppServer = exports.serveAppServer = function serveAppServer(port, cb) {
  createAppServer().listen(port, function () {
    // eslint-disable-next-line no-console
    console.log(_safe2.default.green('App address: http://127.0.0.1:' + port));
    if (typeof cb === 'function') {
      cb();
    }
  });
};
//# sourceMappingURL=appServer.js.map