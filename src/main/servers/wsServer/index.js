import { Server as WebSocketServer } from 'ws';
import uniqueId from 'node-unique';
import expectationsService from '../../expectations';

export default class WSMockServer {
  constructor(config) {
    this.load = this.load.bind(this);
    this.unload = this.unload.bind(this);
    this.add = this.add.bind(this);
    this.type = 'ws';
    this.expectations = [];
    this.loaded = [];
    this.port = config.port || 3010;
    this.name = config.name;
    this.id = config.id;
    this.emitUnload = config.emitUnload;
    this.listening = false;
  }

  getResponse(message) {
    const matchedExpIndex = this.matchExpectation(message);

    if (matchedExpIndex >= 0) {
      const matchedExp = this.loaded[matchedExpIndex];

      if (!matchedExp.infinite) {
        matchedExp.quantity -= 1;
      }

      if (matchedExp.quantity < 1) {
        this.emitUnload(this.id, matchedExp.id);
        this.loaded.splice(matchedExpIndex, 1);
      }

      return matchedExp.instance.responseMessage;
    }

    return undefined;
  }

  matchExpectation(message) {
    return this.loaded.findIndex(expectation => (
      expectation.instance.incomingMessage === message
    ));
  }

  respond() {
    this.instance.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.instance.on('connection', (ws) => {
      this.ws = ws;

      this.startReadingMessages();
    });
  }

  start(cb) {
    this.instance = new WebSocketServer({ port: this.port }, () => {
      this.listening = true;
      cb();
    });
  }

  startReadingMessages() {
    this.ws.on('message', (message) => {
      const response = this.getResponse(message);

      if (response) {
        this.ws.send(response);
      } else {
        this.ws.send('Unknown message');
      }
    });
  }

  stop(cb) {
    this.instance.close(() => {
      this.listening = false;
      cb();
    });
  }

  add(expectations) {
    this.expectations = this.expectations.concat(expectations);
  }

  isLive() {
    return this.listening;
  }

  load(id, quantity, infinite) {
    const instance = expectationsService.create(id);
    const instanceId = uniqueId();
    this.loaded.push({ id: instanceId, instance, quantity, infinite });

    return instanceId;
  }

  unload(id) {
    const expectationToUnloadIndex = this.loaded.indexOf(expectation => expectation.id === id);
    this.loaded.splice(expectationToUnloadIndex, 1);
  }
}
