'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuid = require('cuid');

var _cuid2 = _interopRequireDefault(_cuid);

var _Event = require('./Event');

var _Event2 = _interopRequireDefault(_Event);

var _eventLog = require('../eventLog');

var _Reaction = require('./Reaction');

var _Reaction2 = _interopRequireDefault(_Reaction);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Behaviour = function () {
  function Behaviour(serverId, config) {
    var _this = this;

    _classCallCheck(this, Behaviour);

    this.serverId = serverId;
    this.event = new _Event2.default(config.event.type, config.event.params);
    this.id = (0, _cuid2.default)();
    this.loadedCounter = config.loadedCounter || 1;
    this.runCounter = 0;
    this.reactions = [];
    config.reactions.forEach(function (reactionCfg) {
      _this.reactions.push(_this.createReaction(_this.id, reactionCfg));
    });
    this.pendingReactions = [];
    this.status = 'inactive';
  }

  /* eslint-disable class-methods-use-this */
  // createReaction :: (String, Object) -> Reaction


  _createClass(Behaviour, [{
    key: 'createReaction',
    value: function createReaction(id, cfg) {
      return new _Reaction2.default(id, cfg);
    }
    /* eslint-enable class-methods-use-this */

    // :: void -> void

  }, {
    key: 'execute',
    value: function execute() {
      var _this2 = this;

      if (this.runCounter === this.loadedCounter) {
        return;
      }

      this.status = Behaviour.statuses.PENDING;

      (0, _eventLog.log)('behaviour-status-change', {
        status: Behaviour.statuses.PENDING,
        behaviourId: this.id,
        serverId: this.serverId
      });

      var reactionsFinishedCount = 0;
      var onReactionSuccess = function onReactionSuccess(id) {
        return function () {
          reactionsFinishedCount += 1;

          _this2.pendingReactions = _this2.pendingReactions.filter(function (pR) {
            return pR.id !== id;
          });
          if (reactionsFinishedCount === _this2.reactions.length) {
            _this2.status = Behaviour.statuses.FINISHED;

            (0, _eventLog.log)('behaviour-status-change', {
              status: Behaviour.statuses.FINISHED,
              behaviourId: _this2.id,
              serverId: _this2.serverId
            });
          }
        };
      };

      this.pendingReactions = this.reactions.map(function (r) {
        return {
          id: r.id,
          cancel: r.execute(onReactionSuccess(r.id))
        };
      });
      this.runCounter += 1;
    }

    // cancel :: void -> void

  }, {
    key: 'cancel',
    value: function cancel() {
      if (this.pendingReactions.length) {
        this.pendingReactions.forEach(function (pR) {
          return pR.cancel();
        });
        this.status = Behaviour.statuses.CANCELLED;

        (0, _eventLog.log)('behaviour-status-change', {
          status: Behaviour.statuses.CANCELLED,
          behaviourId: this.id,
          serverId: this.serverId
        });
      }
    }
  }]);

  return Behaviour;
}();

exports.default = Behaviour;


Behaviour.statuses = {
  INACTIVE: 'inactive',
  PENDING: 'pending',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};
//# sourceMappingURL=Behaviour.js.map