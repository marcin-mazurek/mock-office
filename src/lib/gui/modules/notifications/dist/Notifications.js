'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Notification = require('./Notification');

var _Notification2 = _interopRequireDefault(_Notification);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var NotificationsList = function (_React$Component) {
  _inherits(NotificationsList, _React$Component);

  function NotificationsList() {
    _classCallCheck(this, NotificationsList);

    return _possibleConstructorReturn(this, (NotificationsList.__proto__ || Object.getPrototypeOf(NotificationsList)).apply(this, arguments));
  }

  _createClass(NotificationsList, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      var oldNotifications = this.props.notifications;
      var currentNotifications = nextProps.notifications;

      currentNotifications.forEach(function (currentNotification) {
        if (!oldNotifications.find(function (oldNotification) {
          return oldNotification.id === currentNotification.id;
        })) {
          _this2.props.onNewNotificationDisplayed(currentNotification.id);
        }
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          notifications = _props.notifications,
          onNotificationClick = _props.onNotificationClick;


      return _react2.default.createElement(
        'ul',
        { className: 'notifications' },
        notifications.map(function (_ref) {
          var id = _ref.id,
              text = _ref.text,
              type = _ref.type;
          return _react2.default.createElement(
            'li',
            { className: 'notification__item', key: id },
            _react2.default.createElement(_Notification2.default, {
              id: id,
              text: text,
              type: type,
              onNotificationClick: onNotificationClick
            })
          );
        })
      );
    }
  }]);

  return NotificationsList;
}(_react2.default.Component);

exports.default = NotificationsList;


NotificationsList.propTypes = {
  notifications: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.string.isRequired,
    text: _propTypes2.default.string.isRequired,
    type: _propTypes2.default.string.isRequired
  })),
  onNotificationClick: _propTypes2.default.func.isRequired,
  onNewNotificationDisplayed: _propTypes2.default.func.isRequired
};

NotificationsList.defaultProps = {
  notifications: []
};