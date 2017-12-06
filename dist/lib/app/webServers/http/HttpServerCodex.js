'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RequestBehaviour = require('./RequestBehaviour');

var _RequestBehaviour2 = _interopRequireDefault(_RequestBehaviour);

var _codex = require('../../codex');

var _codex2 = _interopRequireDefault(_codex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HttpServerCodex = function (_Codex) {
  _inherits(HttpServerCodex, _Codex);

  function HttpServerCodex(serverId) {
    _classCallCheck(this, HttpServerCodex);

    var _this = _possibleConstructorReturn(this, (HttpServerCodex.__proto__ || Object.getPrototypeOf(HttpServerCodex)).call(this, serverId));

    _this.addBehaviour = _this.addBehaviour.bind(_this);
    return _this;
  }

  // addBehaviour :: Object -> Behaviour


  _createClass(HttpServerCodex, [{
    key: 'addBehaviour',
    value: function addBehaviour(behaviourCfg) {
      var behaviour = void 0;

      switch (behaviourCfg.event.type) {
        case 'request':
          {
            behaviour = new _RequestBehaviour2.default(this.serverId, behaviourCfg);
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

  return HttpServerCodex;
}(_codex2.default);

exports.default = HttpServerCodex;
//# sourceMappingURL=HttpServerCodex.js.map