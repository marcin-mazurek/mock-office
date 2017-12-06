'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Reaction2 = require('../../codex/Reaction');

var _Reaction3 = _interopRequireDefault(_Reaction2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResponseReaction = function (_Reaction) {
  _inherits(ResponseReaction, _Reaction);

  function ResponseReaction() {
    _classCallCheck(this, ResponseReaction);

    return _possibleConstructorReturn(this, (ResponseReaction.__proto__ || Object.getPrototypeOf(ResponseReaction)).apply(this, arguments));
  }

  _createClass(ResponseReaction, [{
    key: 'configureReceiver',

    // configureReceiver :: (http.ClientRequest, http.ServerResponse) -> void
    value: function configureReceiver(req, res) {
      this.req = req;
      this.res = res;
    }
  }, {
    key: 'doCommand',
    value: function doCommand() {
      // allow CORS by default
      if (this.req.headers.origin) {
        this.res.set('Access-Control-Allow-Origin', this.req.headers.origin);
      }

      if (this.params.headers) {
        this.res.set(this.params.headers);
      }

      if (this.params.status) {
        this.res.status(this.params.status);
      }

      this.res.json(this.params.payload);
    }
  }]);

  return ResponseReaction;
}(_Reaction3.default);

exports.default = ResponseReaction;
//# sourceMappingURL=ResponseReaction.js.map