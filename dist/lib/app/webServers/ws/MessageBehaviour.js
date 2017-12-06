'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Behaviour2 = require('../../codex/Behaviour');

var _Behaviour3 = _interopRequireDefault(_Behaviour2);

var _MessageReaction = require('./MessageReaction');

var _MessageReaction2 = _interopRequireDefault(_MessageReaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MessageBehaviour = function (_Behaviour) {
  _inherits(MessageBehaviour, _Behaviour);

  function MessageBehaviour() {
    _classCallCheck(this, MessageBehaviour);

    return _possibleConstructorReturn(this, (MessageBehaviour.__proto__ || Object.getPrototypeOf(MessageBehaviour)).apply(this, arguments));
  }

  _createClass(MessageBehaviour, [{
    key: 'configureReceiver',

    // configureReceiver :: Socket -> MessageBehaviour
    value: function configureReceiver(ws) {
      this.reactions.filter(function (r) {
        return r instanceof _MessageReaction2.default;
      }).forEach(function (r) {
        return r.configureReceiver(ws);
      });

      return this;
    }

    // createReaction :: Object -> MessageReaction
    // eslint-disable-next-line class-methods-use-this

  }, {
    key: 'createReaction',
    value: function createReaction(id, reactionCfg) {
      var reaction = void 0;

      if (reactionCfg.type === 'message') {
        reaction = new _MessageReaction2.default(id, reactionCfg);
      } else {
        throw new Error('Invalid reaction type: ' + reactionCfg.type);
      }

      return reaction;
    }
  }]);

  return MessageBehaviour;
}(_Behaviour3.default);

exports.default = MessageBehaviour;
//# sourceMappingURL=MessageBehaviour.js.map