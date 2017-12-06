'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _ajv = require('ajv');

var _ajv2 = _interopRequireDefault(_ajv);

var _Behaviour = require('./Behaviour');

var _Behaviour2 = _interopRequireDefault(_Behaviour);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Codex = function () {
  function Codex(serverId) {
    _classCallCheck(this, Codex);

    this.serverId = serverId;
    this.behaviours = [];
    this.addBehaviour = this.addBehaviour.bind(this);
    this.removeBehaviour = this.removeBehaviour.bind(this);
    this.matchBehaviour = this.matchBehaviour.bind(this);
  }

  // getBehaviour :: String -> Behaviour


  _createClass(Codex, [{
    key: 'getBehaviour',
    value: function getBehaviour(id) {
      return this.behaviours.find(function (b) {
        return b.id === id;
      });
    }

    // addBehaviour :: Object -> Behaviour

  }, {
    key: 'addBehaviour',
    value: function addBehaviour(behaviourCfg) {
      var behaviour = new _Behaviour2.default(this.serverId, behaviourCfg);
      this.behaviours.push(behaviour);
      return behaviour;
    }

    // removeBehaviour :: String -> Boolean

  }, {
    key: 'removeBehaviour',
    value: function removeBehaviour(behaviourId) {
      var behaviourIndex = this.behaviours.findIndex(function (b) {
        return b.id === behaviourId;
      });

      if (behaviourIndex < 0) {
        return false;
      }

      this.behaviours.splice(behaviourIndex, 1);

      return true;
    }

    // matchBehaviour :: Object -> Behaviour

  }, {
    key: 'matchBehaviour',
    value: function matchBehaviour(event) {
      var ajv = new _ajv2.default();

      var behaviour = this.behaviours.find(function (b) {
        if (!b.event) {
          return true;
        }

        if (!event) {
          return false;
        }

        if (b.event.type !== event.type) {
          return false;
        }

        return ajv.validate(b.event.params, event.params);
      });
      return behaviour;
    }
  }]);

  return Codex;
}();

exports.default = Codex;
//# sourceMappingURL=Codex.js.map