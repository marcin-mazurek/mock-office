'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.allNotificationsSelector = undefined;

var _reselect = require('reselect');

var allNotificationsSelector = exports.allNotificationsSelector = (0, _reselect.createSelector)(function (state) {
  return state.get('notifications').ids;
}, function (state) {
  return state.get('notifications').entities;
}, function (ids, entities) {
  return ids.map(function (id) {
    return entities[id];
  });
}); /* eslint-disable import/prefer-default-export */