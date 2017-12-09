'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var NOTIFICATION_EXPIRED = exports.NOTIFICATION_EXPIRED = 'notifications/NOTIFICATION_EXPIRED';
var notificationExpiredAction = exports.notificationExpiredAction = function notificationExpiredAction(id) {
  return {
    type: NOTIFICATION_EXPIRED,
    id: id
  };
};
var ADD_NOTIFICATION = exports.ADD_NOTIFICATION = 'notifications/ADD_NOTIFICATION';
var addNotificationAction = exports.addNotificationAction = function addNotificationAction(status, message) {
  return {
    type: ADD_NOTIFICATION,
    status: status,
    message: message
  };
};
var NEW_NOTIFICATION_DISPLAYED = exports.NEW_NOTIFICATION_DISPLAYED = 'notifications/NEW_NOTIFICATION_DISPLAYED';
var newNotificationDisplayedAction = exports.newNotificationDisplayedAction = function newNotificationDisplayedAction(id) {
  return {
    type: NEW_NOTIFICATION_DISPLAYED,
    id: id
  };
};
var NOTIFICATION_CLICKED = exports.NOTIFICATION_CLICKED = 'notifications/NOTIFICATION_CLICKED';
var notificationsClickedAction = exports.notificationsClickedAction = function notificationsClickedAction(id) {
  return {
    type: NOTIFICATION_CLICKED,
    id: id
  };
};