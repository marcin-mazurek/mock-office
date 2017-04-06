import { EventEmitter } from 'events';

const ee = new EventEmitter();

export class ServerEventsEmitter {
  constructor(params) {
    this.params = params || '';
  }
  extend(tuple) {
    return new ServerEventsEmitter(Object.assign({}, this.params, tuple));
  }
  emit(eventType, params) {
    ee.emit(eventType, Object.assign({}, this.params, params));
  }
}

export default ee;
