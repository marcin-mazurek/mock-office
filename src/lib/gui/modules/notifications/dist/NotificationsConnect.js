'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reactRedux = require('react-redux');

var _Notifications = require('./Notifications');

var _Notifications2 = _interopRequireDefault(_Notifications);

var _actions = require('./actions');

var _selectors = require('./selectors');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapStateToProps = function mapStateToProps(state) {
  return {
    notifications: (0, _selectors.allNotificationsSelector)(state)
  };
};
var mapDispatchToProps = {
  onNotificationClick: _actions.notificationsClickedAction,
  onNewNotificationDisplayed: _actions.newNotificationDisplayedAction
};
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(_Notifications2.default);