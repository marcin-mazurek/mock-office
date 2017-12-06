'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cuid = require('cuid');

var _cuid2 = _interopRequireDefault(_cuid);

var _rxjs = require('rxjs');

var _eventLog = require('../eventLog');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reaction = function () {
  function Reaction(behaviourId, config) {
    _classCallCheck(this, Reaction);

    this.id = (0, _cuid2.default)();
    this.behaviourId = behaviourId;
    this.schedule = config.schedule || {};
    this.params = config.params || {};
    this.type = config.type;
    this.status = 'inactive';
  }

  // execute :: void -> Function


  _createClass(Reaction, [{
    key: 'execute',
    value: function execute(success) {
      var _this = this;

      var schedule$ = this.schedule.interval ? _rxjs.Observable.interval(this.schedule.interval) : _rxjs.Observable.of(1);

      schedule$ = this.schedule.delay ? schedule$.observeOn(_rxjs.Scheduler.async, this.schedule.delay) : schedule$.observeOn(_rxjs.Scheduler.queue);

      this.status = Reaction.statuses.PENDING;

      (0, _eventLog.log)('reaction-status-changed', {
        status: Reaction.statuses.PENDING,
        reactionId: this.id,
        behaviourId: this.behaviourId
      });

      var subscription = schedule$.do(function () {
        _this.doCommand();
      }).subscribe({
        complete: function complete() {
          if (success) {
            success();
          }

          _this.status = Reaction.statuses.FINISHED;

          (0, _eventLog.log)('reaction-status-changed', {
            status: Reaction.statuses.FINISHED,
            reactionId: _this.id,
            behaviourId: _this.behaviourId
          });
        }
      });

      return function () {
        subscription.unsubscribe();

        _this.status = Reaction.statuses.CANCELLED;

        (0, _eventLog.log)('reaction-status-changed', {
          status: Reaction.statuses.CANCELLED,
          reactionId: _this.id,
          behaviourId: _this.behaviourId
        });
      };
    }

    /* eslint-disable class-methods-use-this */
    // To implement by subclasses
    // action :: void -> void

  }, {
    key: 'doCommand',
    value: function doCommand() {}
    /* eslint-enable class-methods-use-this */

  }]);

  return Reaction;
}();

exports.default = Reaction;


Reaction.statuses = {
  INACTIVE: 'inactive',
  PENDING: 'pending',
  FINISHED: 'finished',
  CANCELLED: 'cancelled'
};
//# sourceMappingURL=Reaction.js.map