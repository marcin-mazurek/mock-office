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

  getResponse(req) {
    const matchedExpIndex = this.matchExpectation(req);

    if (matchedExpIndex >= 0) {
      const matchedExp = this.loaded[matchedExpIndex];

      if (!matchedExp.infinite) {
        matchedExp.quantity -= 1;
      }

      if (matchedExp.quantity < 1) {
        this.emitUnload(this.id, matchedExp.id);
        this.loaded.splice(matchedExpIndex, 1);
      }

      return matchedExp;
    }

    return undefined;
  }

  matchExpectation(req) {
    return this.loaded.findIndex(expectation => (
      expectation.instance.request.url === req.url
    ));
  }

  start(cb) {
    this.wss = new WebSocketServer({ port: this.port });

    this.wss.on('error', (err) => {
      // eslint-disable-next-line no-console
      console.error(err.message);
    });

    this.wss.on('listening', () => {
      this.listening = true;
    });

    this.wss.on('connection', (ws) => {
      this.ws = ws;
      cb();

      this.startReadingMessages();
    });
  }

  startReadingMessages() {
    this.ws.on('message', () => {
      this.ws.send(JSON.stringify({ message: 'its JSON!' }));
    });
  }

  stop(cb) {
    this.wss.close(() => {
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
