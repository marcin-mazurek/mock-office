import { EventEmitter } from 'events';

const emitter = new EventEmitter();

export const addListener = emitter.on.bind(emitter);
export const removeListener = emitter.removeListener.bind(emitter);

export class Emitter {
  constructor(params) {
    this.params = params || {};
  }

  extend(extraParams) {
    return new Emitter(
      Object.assign({}, this.params, extraParams)
    );
  }

  emit(event, params) {
    emitter.emit(event, Object.assign({}, this.params, params));
  }
}
