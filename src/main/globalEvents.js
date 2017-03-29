import { EventEmitter } from 'events';

const ee = new EventEmitter();

export class ServerEventsEmitter {
  constructor(params) {
    this.params = params || '';
  }
  extend(tuple) {
    return new ServerEventsEmitter(Object.assign({}, this.params, tuple));
  }
  emit(eventType) {
    ee.emit(eventType, this.params);
  }
}

export default ee;
