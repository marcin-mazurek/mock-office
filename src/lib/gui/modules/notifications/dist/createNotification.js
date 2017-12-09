'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _cuid = require('cuid');

var _cuid2 = _interopRequireDefault(_cuid);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (params) {
  var notification = {};

  notification.id = (0, _cuid2.default)();
  switch (params.type) {
    case 'error':
      {
        notification.type = 'error';
        break;
      }
    case 'success':
      {
        notification.type = 'success';
        break;
      }
    default:
      {
        notification.type = 'info';
      }
  }
  notification.text = params.text;

  return notification;
};