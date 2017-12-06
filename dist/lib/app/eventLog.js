'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.on = exports.log = undefined;

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var eventLog = new _events2.default();
var log = exports.log = eventLog.emit.bind(eventLog);
var on = exports.on = eventLog.on.bind(eventLog);
//# sourceMappingURL=eventLog.js.map