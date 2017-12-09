'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Notifications = require('./Notifications');

var _actions = require('./actions');

var NOTIFICATION_EXPIRATION_TIME = 5000;
var expireNotification = function expireNotification(_ref) {
  var id = _ref.id;
  return new Promise(function (resolve) {
    setTimeout(function () {
      return resolve(id);
    }, NOTIFICATION_EXPIRATION_TIME);
  });
};

exports.default = function (action$) {
  return action$.ofType(_Notifications.NEW_NOTIFICATION_DISPLAYED).flatMap(expireNotification).map(function (id) {
    return (0, _actions.notificationExpiredAction)(id);
  });
};