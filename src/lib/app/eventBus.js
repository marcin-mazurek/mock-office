import EventEmitter from 'events';

const eventLog = new EventEmitter();
export const log = eventLog.emit.bind(eventLog);
export const on = eventLog.on.bind(eventLog);
