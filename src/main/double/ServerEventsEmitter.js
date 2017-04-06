import { EventEmitter } from 'events';

export default class ServerEventsEmitter {
  constructor(params) {
    this._ee = params && params.ee ? params.ee : new EventEmitter();
    this.params = params || '';
    this._emit = this.emit;
  }
  extend(extraParams) {
    return new ServerEventsEmitter(Object.assign({ ee: this._ee }, this.params, extraParams));
  }

  emit(event, params) {
    this._ee.emit(event, Object.assign({}, this.params, params));
  }

  on(event, cb) {
    this._ee.on(event, cb);
  }
}
