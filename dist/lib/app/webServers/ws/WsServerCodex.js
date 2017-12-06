'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MessageBehaviour = require('../ws/MessageBehaviour');

var _MessageBehaviour2 = _interopRequireDefault(_MessageBehaviour);

var _ConnectionBehaviour = require('../ws/ConnectionBehaviour');

var _ConnectionBehaviour2 = _interopRequireDefault(_ConnectionBehaviour);

var _codex = require('../../codex');

var _codex2 = _interopRequireDefault(_codex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WsServerCodex = function (_Codex) {
  _inherits(WsServerCodex, _Codex);

  function WsServerCodex(serverId) {
    _classCallCheck(this, WsServerCodex);

    var _this = _possibleConstructorReturn(this, (WsServerCodex.__proto__ || Object.getPrototypeOf(WsServerCodex)).call(this, serverId));

    _this.addBehaviour = _this.addBehaviour.bind(_this);
    return _this;
  }

  // addBehaviour :: Object -> Behaviour


  _createClass(WsServerCodex, [{
    key: 'addBehaviour',
    value: function addBehaviour(behaviourCfg) {
      var behaviour = void 0;

      switch (behaviourCfg.event.type) {
        case 'message':
          {
            behaviour = new _MessageBehaviour2.default(this.serverId, behaviourCfg);
            break;
          }
        case 'connection':
          {
            behaviour = new _ConnectionBehaviour2.default(this.serverId, behaviourCfg);
            break;
          }
        default:
          {
            throw new Error('Invalid behaviour event type');
          }
      }

      this.behaviours.push(behaviour);
      return behaviour;
    }
  }]);

  return WsServerCodex;
}(_codex2.default);

exports.default = WsServerCodex;
//# sourceMappingURL=WsServerCodex.js.map