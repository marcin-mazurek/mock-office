'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNotification = addNotification;
exports.removeNotification = removeNotification;

var _ramda = require('ramda');

var _createNotification = require('./createNotification');

var _createNotification2 = _interopRequireDefault(_createNotification);

var _Notifications = require('./Notifications');

var _actions = require('./actions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var initialState = {
  ids: [],
  entities: {}
};

function addNotification(state, notificationParams) {
  var notification = (0, _createNotification2.default)(notificationParams);
  var newState = state;

  newState = Object.assign({}, newState, {
    entities: Object.assign({}, newState.entities, _defineProperty({}, notification.id, notification))
  });
  newState = Object.assign({}, newState, { ids: newState.ids.concat([notification.id]) });

  return newState;
}

function removeNotification(state, action) {
  var newState = state;
  newState = Object.assign({}, newState, {
    ids: newState.ids.filter(function (notificationId) {
      return notificationId !== action.id;
    })
  });
  newState = Object.assign({}, newState, {
    entities: Object.assign({}, newState.entities, _defineProperty({}, action.id, null))
  });

  return newState;
}

var createReducer = function createReducer(customReducer) {
  return function reducer() {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments[1];

    var newState = state;

    if ((0, _ramda.is)(Function, customReducer)) {
      newState = customReducer(state, action);
    }

    switch (action.type) {
      case _actions.ADD_NOTIFICATION:
        {
          return addNotification(newState, action);
        }
      case _Notifications.NOTIFICATION_CLICKED:
        {
          return removeNotification(newState, action);
        }
      case _actions.NOTIFICATION_EXPIRED:
        {
          return removeNotification(newState, action);
        }
      default:
        {
          return newState;
        }
    }
  };
};

exports.default = createReducer;