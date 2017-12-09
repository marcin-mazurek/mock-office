'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Notification = function Notification(_ref) {
  var id = _ref.id,
      onNotificationClick = _ref.onNotificationClick,
      text = _ref.text,
      type = _ref.type;
  return _react2.default.createElement(
    'div',
    { className: 'notifications-item', key: id },
    _react2.default.createElement(
      'button',
      {
        className: 'notifications-bubble notifications-bubble--' + type,
        onClick: function onClick() {
          return onNotificationClick(id);
        }
      },
      text
    )
  );
};

Notification.propTypes = {
  id: _propTypes2.default.string.isRequired,
  onNotificationClick: _propTypes2.default.func.isRequired,
  text: _propTypes2.default.string.isRequired,
  type: _propTypes2.default.string.isRequired
};

exports.default = Notification;