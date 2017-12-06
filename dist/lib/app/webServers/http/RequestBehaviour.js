'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Behaviour2 = require('../../codex/Behaviour');

var _Behaviour3 = _interopRequireDefault(_Behaviour2);

var _ResponseReaction = require('./ResponseReaction');

var _ResponseReaction2 = _interopRequireDefault(_ResponseReaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RequestBehaviour = function (_Behaviour) {
  _inherits(RequestBehaviour, _Behaviour);

  function RequestBehaviour() {
    _classCallCheck(this, RequestBehaviour);

    return _possibleConstructorReturn(this, (RequestBehaviour.__proto__ || Object.getPrototypeOf(RequestBehaviour)).apply(this, arguments));
  }

  _createClass(RequestBehaviour, [{
    key: 'configureReceiver',

    // configureReceiver :: (http.ClientRequest, http.ServerResponse) -> RequestBehaviour
    value: function configureReceiver(req, res) {
      this.reactions.filter(function (r) {
        return r instanceof _ResponseReaction2.default;
      }).forEach(function (r) {
        return r.configureReceiver(req, res);
      });
      return this;
    }

    // createReaction :: Object -> ResponseReaction

  }, {
    key: 'createReaction',
    value: function createReaction(id, reactionCfg) {
      if (this.reactions.length > 1) {
        throw new Error('RequestBehaviour can have only single reaction.');
      }

      var reaction = void 0;

      if (reactionCfg.type === 'response') {
        reaction = new _ResponseReaction2.default(id, reactionCfg);
      } else {
        throw new Error('Invalid reaction type: ' + reactionCfg.type);
      }

      return reaction;
    }
  }]);

  return RequestBehaviour;
}(_Behaviour3.default);

exports.default = RequestBehaviour;
//# sourceMappingURL=RequestBehaviour.js.map